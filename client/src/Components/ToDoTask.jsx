import React, { useState } from "react";
import Calendar from "./Calendar";
import { createTask } from "../services/api";
import AddTaskSuccess from "./AddTaskSuccess";

function ToDoTask({ onClose, onTaskAdded }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "To Do"
  });

  const handleDeadlineClick = () => {
    setShowCalendar(true);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const handleDateSelect = (date) => {
    console.log("ToDoTask received date:", date); // Debug log
    
    // Make sure the date is being properly set in the state
    const updatedFormData = {...formData, deadline: date};
    console.log("Updated form data with deadline:", updatedFormData); 
    
    setFormData(updatedFormData);
    setShowCalendar(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

// client/src/Components/ToDoTask.jsx - Enhanced handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (!formData.title) {
      alert("Title is required");
      return;
    }

    // Create a copy of formData to avoid mutating the original
    const taskData = {
      title: formData.title.trim(),
      description: formData.description ? formData.description.trim() : "",
      deadline: formData.deadline || null, // Ensure deadline is explicitly included
      status: formData.status || "To Do"
    };
    
    console.log("Submitting task with data:", JSON.stringify(taskData));
    
    const newTask = await createTask(taskData);
    console.log("Task created with response:", newTask);
    
    if (onTaskAdded) onTaskAdded(newTask);
    setShowSuccessMessage(true);
  } catch (error) {
    console.error("Failed to add task:", error);
    alert("Failed to add task. Please try again.");
  }
};

  // Handle back button click from success message
  const handleBack = () => {
    setShowSuccessMessage(false);
    onClose();
  };

  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center  z-50">
        <div onClick={(e) => e.stopPropagation()}>
          <AddTaskSuccess onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <section className="flex overflow-hidden gap-2.5 items-start max-w-[333px] max-h-[504px] px-5 pt-5 bg-white rounded-xl border shadow-[0px_4px_4px_rgba(0,0,0,0.25)] relative">
      <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-60">
        {/* Header Section */}
        <header className="flex justify-between items-center pb-3.5 w-full border-b border-solid border-b-[color:var(--border-secondary,#E1E2EA)]">
          <div className="flex flex-1 shrink gap-1.5 items-center self-stretch my-auto text-xl font-semibold text-black basis-0 min-w-60">
            <span className="flex shrink-0 self-stretch my-auto w-2 h-2 bg-cyan-400 rounded-full" />
            <h1 className="self-stretch my-auto">ADD TASK</h1>
            <span className="flex shrink-0 self-stretch my-auto bg-white rounded-2xl h-[18px] w-[18px]" />
          </div>
          <button
            className="flex flex-col justify-center items-center self-stretch px-1 my-auto w-5 h-5 bg-white rounded-2xl min-h-5"
            aria-label="Close"
            onClick={onClose}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/1cd7388638f9ab8123e4867584a9662744b58d1cf414617e7b1d8e66918d13d3?placeholderIfAbsent=true"
              className="object-contain w-3.5 aspect-square"
              alt="Close icon"
            />
          </button>
        </header>

        {/* Task Content Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full mt-4">
          {/* Task Title */}
          <div className="w-full">
            <input
              type="text"
              placeholder="TASK 1"
              id="title"
              name="title"
              value={formData.title}
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
              value={formData.description}
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
                className="px-4 py-2 w-full outline-none text-gray-500 text-sm font-semibold font-poppins "
                onClick={handleDeadlineClick}
              >
                {formData.deadline || "Deadline"}
              </button>
            </div>

            {/* Submit Button - KEEPING THE EXACT STYLING AND TEXT AS REQUESTED */}
            <div className="w-1/2">
              <button
                type="submit"
                className="px-4 py-2 w-full outline-none text-gray-500 text-sm font-semibold font-poppins"
              >
                Assigned to
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Calendar Modal - Fixed to appear centered */}
      {showCalendar && (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
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

export default ToDoTask;



