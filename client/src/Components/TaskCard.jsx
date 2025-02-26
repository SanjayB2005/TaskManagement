import React, { useState } from "react";
import { updateTask, deleteTask } from "../services/api";
import Calendar from "./Calendar";

function TaskCard({ id, title, description, deadline, onTaskUpdated, status }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title,
    description,
    deadline
  });
  
  // Determine priority based on status
  const getPriority = () => {
    switch(status) {
      case "To Do":
        // Updated to use the custom amber/orange color rgba(213, 141, 73, 1)
        return { 
          text: "Low", 
          color: "self-start px-1.5 py-1 text-xs font-medium text-amber-600 whitespace-nowrap rounded bg-amber-100 bg-opacity-20" 
        };
      case "On Progress":
        return { 
          text: "High", 
          color: "self-start px-1.5 py-1 text-xs font-medium text-rose-500 whitespace-nowrap rounded bg-rose-300 bg-opacity-10" 
        };
      case "Done":
        return { 
          text: "Completed", 
          color: "self-start px-1.5 py-1 text-xs font-medium text-green-500 whitespace-nowrap rounded bg-green-100" 
        };
      default:
        return { 
          text: "Not Set", 
          color: "text-gray-600" 
        };
    }
  };
  
  const { text: priorityText, color: priorityColor } = getPriority();
  
  const handleStatusChange = async (newStatus) => {
    try {
      console.log(`Moving task ${id} to status: ${newStatus}`);
      const updatedTask = await updateTask(id, { status: newStatus });
      console.log("Server response after status update:", updatedTask);
      
      // Call onTaskUpdated to refresh the board
      if (onTaskUpdated) {
        onTaskUpdated();
      }
      setShowMenu(false);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(id);
      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = () => {
    setEditedTask({
      title,
      description,
      deadline
    });
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: value
    });
  };

  const handleDeadlineClick = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = (date) => {
    setEditedTask({
      ...editedTask,
      deadline: date
    });
    setShowCalendar(false);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedTask = await updateTask(id, editedTask);
      console.log("Task updated:", updatedTask);
      setIsEditing(false);
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Not set") return "Not set";
    
    // Check if dateString is already in ISO format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const date = new Date(dateString);
      if (!isNaN(date)) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
      }
    }
    
    // If it's not ISO format, just return the original string
    return dateString;
  };

  // Edit Mode UI (similar to ToDoTask component)
  if (isEditing) {
    return (
      <section className="flex overflow-hidden gap-2.5 items-start max-w-[333px] max-h-[504px] px-5 pt-5 bg-white rounded-xl border shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative">
        <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-60">
          {/* Header Section */}
          <header className="flex justify-between items-center pb-3.5 w-full border-b border-solid border-b-[color:var(--border-secondary,#E1E2EA)]">
            <div className="flex flex-1 shrink gap-1.5 items-center self-stretch my-auto text-xl font-semibold text-black basis-0 min-w-60">
              <span className="flex shrink-0 self-stretch my-auto w-2 h-2 bg-cyan-400 rounded-full" />
              <h1 className="self-stretch my-auto">EDIT TASK</h1>
              <span className="flex shrink-0 self-stretch my-auto bg-white rounded-2xl h-[18px] w-[18px]" />
            </div>
            <button
              className="flex flex-col justify-center items-center self-stretch px-1 my-auto w-5 h-5 bg-white rounded-2xl min-h-5"
              aria-label="Close"
              onClick={handleCancelEdit}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/1cd7388638f9ab8123e4867584a9662744b58d1cf414617e7b1d8e66918d13d3?placeholderIfAbsent=true"
                className="object-contain w-3.5 aspect-square"
                alt="Close icon"
              />
            </button>
          </header>

          {/* Task Content Form */}
          <div className="flex flex-col gap-4 w-full mt-4">
            {/* Task Title */}
            <div className="w-full">
              <input
                type="text"
                placeholder="TASK TITLE"
                id="title"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-b border-black placeholder:font-bold placeholder:text-black focus:outline-none bg-transparent"
                required
              />
            </div>

            {/* Task Description */}
            <div className="w-full">
              <textarea
                id="description"
                name="description"
                value={editedTask.description || ""}
                onChange={handleInputChange}
                rows="8"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              ></textarea>
            </div>
            
            {/* Task Metadata - Single line for Deadline and Submit */}
            <div className="flex justify-between items-center w-full gap-4 mt-4 mb-4 text-xs font-bold">
              {/* Deadline Button */}
              <div className="relative w-1/2">
                <button
                  type="button"
                  className="px-4 py-2 w-full outline-none text-gray-500 text-sm font-semibold font-poppins"
                  onClick={handleDeadlineClick}
                >
                  {editedTask.deadline ? formatDate(editedTask.deadline) : "Deadline"}
                </button>
              </div>

              {/* Save Button */}
              <div className="w-1/2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 w-full outline-none bg-cyan-500 text-white rounded-md hover:bg-cyan-600 text-sm font-semibold font-poppins"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Modal - Fixed to appear centered */}
        {showCalendar && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold">Select Date</h3>
                <button 
                  onClick={handleCloseCalendar}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <Calendar onSelect={handleDateSelect} />
            </div>
          </div>
        )}
      </section>
    );
  }

  // Normal View UI
  return (
    <div className="grow shrink rounded-none min-w-60 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[310px]">
      <div className="flex flex-col px-5 py-6 w-full bg-white rounded-2xl">
        {/* Priority Indicator */}
        <div className={`text-xs font-medium mb-1 ${priorityColor}`}>
          {priorityText}
        </div>
        
        <div className="flex justify-between">
          <div className="self-start text-lg font-semibold text-slate-900">
            {title}
          </div>
          <div className="relative">
            <button 
              className="text-base font-extrabold tracking-tighter text-slate-900 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            >
              . . .
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleEditClick}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={() => handleStatusChange("To Do")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Move to To Do
                  </button>
                  <button
                    onClick={() => handleStatusChange("On Progress")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Move to In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange("Done")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mark as Done
                  </button>
                  <button
                    onClick={handleDeleteTask}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {description && (
          <div className="mt-1.5 text-xs text-zinc-500">{description}</div>
        )}
        
        {/* Make sure deadline is displayed properly */}
        <div className="flex gap-2.5 items-center self-start mt-8 text-xs font-bold leading-none text-zinc-600">
          <div className="self-stretch my-auto">
            Deadline 
            <span className="font-medium ml-1 text-cyan-600">
              {formatDate(deadline)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;