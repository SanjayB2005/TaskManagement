const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json());
app.use(cors());
  
// server/index.js - Update MongoDB connection with more robust error handling
mongoose.connect('mongodb://localhost:27017/mernstack', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1); // Exit if MongoDB connection fails
});

// creating a schema with explicit deadline field
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
    enum: ['To Do', 'On Progress', 'Done'],
    default: 'To Do'
  }
}, { timestamps: true });

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

// Get all todos API
app.get('/todos', async (req, res) => {
  try {
    const todos = await todoModel.find();
    console.log("Fetched todos count:", todos.length);
    // Log a few sample todos with their deadlines
    if (todos.length > 0) {
      console.log("Sample todo deadlines:", todos.slice(0, 3).map(t => ({
        id: t._id,
        title: t.title,
        deadline: t.deadline || "No deadline"
      })));
    }
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
}); 

// Update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const {title, description, deadline, status} = req.body;
    const id = req.params.id;
    
    console.log("Updating task:", id, req.body);
    
    const updateData = {};
    
    // Only include fields that were sent in the request
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (status !== undefined) updateData.status = status;
    
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

port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});