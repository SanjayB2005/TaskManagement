// client/src/Components/KanbanBoard.jsx - Update to include Timeout column
import React, { useState, useEffect } from "react";
import KanbanColumn from "./KanbanColumn";
import { fetchTasks, checkTimeoutTasks } from "../services/api";

function KanbanBoard({ refreshTrigger, searchQuery = "", activeFilter = "All", onTaskUpdated }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // Track which columns have matching tasks
  const [columnsWithMatches, setColumnsWithMatches] = useState({
    todo: true,
    inProgress: true,
    done: true,
    timeout: true
  });

  // Check for timed-out tasks every minute
  useEffect(() => {
    const checkTimeout = async () => {
      try {
        // Use 24 hours as max duration (1440 minutes)
        await checkTimeoutTasks(1440);
        // Refresh tasks after timeout check
        setUpdateCounter(prev => prev + 1);
      } catch (error) {
        console.error("Error checking for task timeouts:", error);
      }
    };
    
    // Run immediately on component mount
    checkTimeout();
    
    // Then set interval for regular checks
    const intervalId = setInterval(checkTimeout, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Fetch tasks
  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTasks();
        console.log("Fetched tasks in KanbanBoard:", data); 
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [refreshTrigger, updateCounter]);

  // Apply search and filter
  useEffect(() => {
    let filtered = [...tasks];
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        task => 
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredTasks(filtered);
    
    // Determine which columns have matching tasks
    const todoHasMatches = filtered.some(task => task.status === "To Do");
    const inProgressHasMatches = filtered.some(task => task.status === "On Progress");
    const doneHasMatches = filtered.some(task => task.status === "Done");
    const timeoutHasMatches = filtered.some(task => task.status === "Timeout");
    
    setColumnsWithMatches({
      todo: todoHasMatches,
      inProgress: inProgressHasMatches,
      done: doneHasMatches,
      timeout: timeoutHasMatches
    });
    
  }, [tasks, searchQuery]);

  // Filter tasks by status from the filtered tasks
  const todoTasks = filteredTasks.filter(task => task.status === "To Do");
  const inProgressTasks = filteredTasks.filter(task => task.status === "On Progress");
  const doneTasks = filteredTasks.filter(task => task.status === "Done");
  const timeoutTasks = filteredTasks.filter(task => task.status === "Timeout");

  const handleTaskUpdated = () => {
    console.log("Task updated, refreshing board...");
    // Increment counter to trigger a re-fetch
    setUpdateCounter(prev => prev + 1);
    
    // Also notify parent component so it can update task stats
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  // Determine which columns to show based on filter and search results
  const showToDoColumn = (activeFilter === "All" || activeFilter === "Low Priority") && 
                         (searchQuery === "" || columnsWithMatches.todo);
                         
  const showInProgressColumn = (activeFilter === "All" || activeFilter === "High Priority") && 
                              (searchQuery === "" || columnsWithMatches.inProgress);
                              
  const showDoneColumn = activeFilter === "All" && 
                        (searchQuery === "" || columnsWithMatches.done);
  
  const showTimeoutColumn = activeFilter === "All" && 
                        (searchQuery === "" || columnsWithMatches.timeout);
  
  // Check if any columns are visible
  const noColumnsVisible = !showToDoColumn && !showInProgressColumn && 
                          !showDoneColumn && !showTimeoutColumn;

  return (
    <div className="flex flex-1 shrink gap-10 justify-center basis-0 min-w-60 max-md:max-w-full">
      {noColumnsVisible ? (
        <div className="flex items-center justify-center w-full py-12 text-center text-gray-500">
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">No matching tasks found</p>
            <p className="mt-2">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap flex-1 shrink gap-10 justify-between basis-0 min-w-60 size-full max-md:max-w-full">
          {showToDoColumn && (
            <KanbanColumn
              title="To Do"
              count={todoTasks.length}
              tasks={mapTasksToColumnFormat(todoTasks)}
              dotColor="bg-indigo-600"
              dividerSrc="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/9adb4f3505cdfe2248369f1fb5e31a3c9f8806a70b58eea1e94f90e1a2d32776?placeholderIfAbsent=true"
              onTaskUpdated={handleTaskUpdated}
            />
          )}

          {showInProgressColumn && (
            <KanbanColumn
              title="On Progress"
              count={inProgressTasks.length}
              tasks={mapTasksToColumnFormat(inProgressTasks)}
              dotColor="bg-amber-500"
              dividerSrc="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/993f2e29f8f2b542ff928a93aecc8e747dbb70ef1b6b1fa13f13cf775e8503c8?placeholderIfAbsent=true"
              onTaskUpdated={handleTaskUpdated}
            />
          )}

          {showDoneColumn && (
            <KanbanColumn
              title="Done"
              count={doneTasks.length}
              tasks={mapTasksToColumnFormat(doneTasks)}
              dotColor="bg-blue-400"
              dividerSrc="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/38cf1675a2977a9da0f0be331e66d4466fa76458370b9f331cd3c2ee5855a470?placeholderIfAbsent=true"
              onTaskUpdated={handleTaskUpdated}
            />
          )}
          
          {showTimeoutColumn && (
            <KanbanColumn
              title="Timeout"
              count={timeoutTasks.length}
              tasks={mapTasksToColumnFormat(timeoutTasks)}
              dotColor="bg-red-500"
              dividerSrc="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/38cf1675a2977a9da0f0be331e66d4466fa76458370b9f331cd3c2ee5855a470?placeholderIfAbsent=true"
              onTaskUpdated={handleTaskUpdated}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Update the mapTasksToColumnFormat function

const mapTasksToColumnFormat = (tasksArray) => {
  return tasksArray.map(task => {
    return {
      id: task._id,
      title: task.title,
      description: task.description,
      deadline: task.deadline || "Not set",
      duration: task.duration || 0,
      startedAt: task.startedAt || null,
      status: task.status
    };
  });
};

export default KanbanBoard;