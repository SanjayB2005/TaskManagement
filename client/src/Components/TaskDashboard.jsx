import React, { useState, useEffect } from "react";
import SearchHeader from "./SearchHeader";
import TaskStatistics from "./TaskStatistics";
import KanbanBoard from "./KanbanBoard";
import ToDoTask from "./ToDoTask";
import { fetchTasks } from "../services/api";

function TaskDashboard() {
  const [showToDoTask, setShowToDoTask] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [taskStats, setTaskStats] = useState({
    expired: 0,
    active: 0,
    completed: 0,
    timedOut: 0, // Added timedOut stat
    total: 0
  });

  

  // Function to update task stats
  const updateTaskStats = async () => {
    try {
      const tasks = await fetchTasks();
      
      const now = new Date();
      let expired = 0;
      let active = 0;
      let completed = 0;
      let timedOut = 0;
      
      tasks.forEach(task => {
        if (task.status === 'Done') {
          completed++;
        } else if (task.status === 'Timeout') {
          timedOut++;
        } else {
          active++;
          if (task.deadline) {
            const deadlineDate = new Date(task.deadline);
            if (deadlineDate < now) {
              expired++;
            }
          }
        }
      });
      
      setTaskStats({
        expired,
        active,
        completed,
        timedOut, // Include timedOut in the state update
        total: tasks.length
      });
    } catch (error) {
      console.error("Error fetching task statistics:", error);
    }
  };

  // Update stats when component mounts and refreshTrigger changes
  useEffect(() => {
    updateTaskStats();
  }, [refreshTrigger]);

  const handleAddTaskClick = () => {
    setShowToDoTask(true);
  };

  const handleCloseToDoTask = () => {
    setShowToDoTask(false);
  };

  const handleTaskAdded = () => {
    // Increment to trigger a refresh of the board and stats
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  // This function will be called whenever a task status is updated
  const handleTaskUpdated = () => {
    updateTaskStats();
  };

  return (
    <div className="overflow-hidden px-5 pt-12 pb-20 bg-white max-md:px-5">
      <SearchHeader 
        onSearch={handleSearch} 
        onFilter={handleFilter} 
      />
      <div className="flex flex-wrap gap-10 justify-center items-start mt-14 w-full max-md:mt-10 max-md:max-w-full">
        <TaskStatistics 
          onAddTaskClick={handleAddTaskClick}
          taskStats={taskStats} // Pass the taskStats down as props
        />
        <KanbanBoard 
          refreshTrigger={refreshTrigger} 
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          onTaskUpdated={handleTaskUpdated} // Add this callback to update stats when tasks are updated
        />
      </div>
      {showToDoTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <ToDoTask 
            onClose={handleCloseToDoTask} 
            onTaskAdded={handleTaskAdded}
          />
        </div>
      )}
    </div>
  );
}

export default TaskDashboard;