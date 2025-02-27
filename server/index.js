const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

app.use(express.json());
// Update the CORS configuration
// Update these lines at the top of your file
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'https://task-management-a5ee.vercel.app',
    
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   optionsSuccessStatus: 200
// }));
// app.options('*', cors()); // Enable pre-flight for all routes
app.use(cors());
  
// server/index.js - Update MongoDB connection with more robust error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernstack';

// Update MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Add error handlers
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
// creating a schema with explicit deadline field
// server/index.js - Update the schema
// Update your schema to include duration and startedAt

const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String
  },
  description: String,
  deadline: {
    type: String  // Explicitly define the deadline field
  },
  status: {
    type: String,
    enum: ['To Do', 'On Progress', 'Done', 'Timeout'],
    default: 'To Do'
  },
  duration: {
    type: Number,  // Duration in minutes
    default: 0
  },
  startedAt: {
    type: Date // When the task was moved to "On Progress"
  }
}, { timestamps: true });

// Add a method to check if a task has timed out
todoSchema.methods.hasTimedOut = function(maxDurationMinutes = 1440) { // Default 24 hours
  if (this.status !== 'On Progress' || !this.startedAt) return false;
  
  const now = new Date();
  const elapsedMs = now - this.startedAt;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  
  return elapsedMinutes > maxDurationMinutes;
};

// creating a model
const todoModel = mongoose.model('Todo', todoSchema);

// Create a new todo API
// server/index.js - Enhanced POST handler
app.post('/todos', async(req, res) => {
  console.log("Server received request to create todo");
  console.log("Request body:", req.body);
  
  const { title, description, deadline, status } = req.body;
  
  // Validate required fields
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  
  console.log("Processing task with data:", { 
    title, 
    description, 
    deadline: deadline || "No deadline provided", 
    status 
  });
  
  try {
    // Create new todo document
    const newTodo = new todoModel({
      title, 
      description, 
      deadline, // This should be saved in the database
      status: status || 'To Do'
    });
    
    // Save to database
    const savedTodo = await newTodo.save();
    console.log("Successfully saved todo:", savedTodo);
    console.log("Deadline saved as:", savedTodo.deadline);
    
    // Return the saved document
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error("Error saving todo:", error);
    res.status(500).json({ message: error.message });
  }
});


// server/index.js - Add after other routes

// Check for timed-out tasks
// Add this endpoint after your other routes

// Check for timed-out tasks
app.get('/todos/check-timeout', async (req, res) => {
  try {
    const maxDuration = Number(req.query.maxDuration) || 1440; // Default to 24 hours (1440 minutes)
    
    // Find tasks in progress with a startedAt date
    const tasksInProgress = await todoModel.find({ 
      status: 'On Progress', 
      startedAt: { $exists: true, $ne: null } 
    });
    
    const now = new Date();
    const timedOutTasks = [];
    
    // Check each task for timeout
    for (const task of tasksInProgress) {
      const elapsedMs = now - task.startedAt;
      const elapsedMinutes = Math.floor(elapsedMs / 60000);
      
      // Calculate the duration spent so far
      task.duration = elapsedMinutes;
      
      if (elapsedMinutes > maxDuration) {
        // Task has timed out, update status
        task.status = 'Timeout';
        timedOutTasks.push(task._id);
        await task.save();
      } else {
        // Just update the duration
        await task.save();
      }
    }
    
    res.json({ 
      checked: tasksInProgress.length,
      timedOut: timedOutTasks.length,
      taskIds: timedOutTasks
    });
  } catch (error) {
    console.error("Error checking for timed-out tasks:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a task's status to handle the startedAt field
// Update your PUT endpoint

// Update a task's status to handle the startedAt field
app.put("/todos/:id", async (req, res) => {
  try {
    const {title, description, deadline, status, duration} = req.body;
    const id = req.params.id;
    
    console.log("Updating task:", id, req.body);
    
    const updateData = {};
    
    // Only include fields that were sent in the request
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (duration !== undefined) updateData.duration = duration;
    
    // Special handling for status changes to track when tasks move to "On Progress"
    if (status !== undefined) {
      updateData.status = status;
      
      // If moving to "On Progress", set the startedAt field
      if (status === "On Progress") {
        // Check if it's already in progress
        const currentTask = await todoModel.findById(id);
        if (!currentTask || currentTask.status !== "On Progress") {
          updateData.startedAt = new Date();
        }
      } else if (status === "Done") {
        // When task is completed, calculate final duration if it was in progress
        const currentTask = await todoModel.findById(id);
        if (currentTask && currentTask.status === "On Progress" && currentTask.startedAt) {
          const now = new Date();
          const elapsedMs = now - currentTask.startedAt;
          updateData.duration = Math.floor(elapsedMs / 60000); // Convert ms to minutes
        }
      }
    }
    
    const updatedTodo = await todoModel.findByIdAndUpdate(id, updateData, {new: true});
    
    if(!updatedTodo) {
      return res.status(404).json({message: 'Todo not found'});
    }
    
    console.log("Updated todo:", updatedTodo);
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting task:", id);
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
});

// Add this route after your existing routes



app.get('/', (req, res) => {
  const routes = [
    '- GET    /todos',
    '- POST   /todos',
    '- PUT    /todos/:id',
    '- DELETE /todos/:id',
    '- GET    /todos/check-timeout'
  ];

  const htmlResponse = `
    <html>
      <head>
        <title>Task Management API</title>
        <style>
          body { 
            font-family: monospace; 
            padding: 20px; 
            line-height: 1.6;
          }
          h1 { color: #333; }
          pre { 
            background: #f4f4f4; 
            padding: 15px; 
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <h1>Task Management API</h1>
        <p>Server is running on port ${port}</p>
        <h2>Available Routes:</h2>
        <pre>${routes.join('\n')}</pre>
      </body>
    </html>
  `;

  res.send(htmlResponse);
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await todoModel.find({});
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update the server startup code at the bottom of the file
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Available routes:`);
  console.log(`- GET    /todos`);
  console.log(`- POST   /todos`);
  console.log(`- PUT    /todos/:id`);
  console.log(`- DELETE /todos/:id`);
  console.log(`- GET    /todos/check-timeout`);
});