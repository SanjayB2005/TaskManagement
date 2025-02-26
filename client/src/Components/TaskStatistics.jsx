import React from "react";
import TaskStatCard from "./TaskStatCard";
import AddTaskButton from "./AddTaskButton";
import image from '../assets/image.png';
import image2 from '../assets/image2.png';

function TaskStatistics({ onAddTaskClick, taskStats }) {
  // Use provided taskStats or initialize with default values
  const stats = taskStats || {
    expired: 0,
    active: 0,
    completed: 0,
    timedOut: 0, // New stat for timed out tasks
    total: 0
  };

  return (
    <div className="h-[668px] min-w-60 w-[268px]">
      <TaskStatCard
        iconBgColor="bg-red-600"
        iconSrc="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/2b71e9ed77d23a8ed8b4707ffae22ae3df2fa6be3cf82848cefd922f0ed4e388?placeholderIfAbsent=true"
        title="Expired Tasks"
        count={stats.expired}
      />

      <TaskStatCard
        iconBgColor="bg-red-400"
        iconSrc={image}
        title="All Active Tasks"
        count={stats.active}
        hasIcon={true}
      />

      <TaskStatCard
        iconBgColor="bg-blue-400"
        title="Completed Tasks"
        iconSrc={image2}
        count={stats.completed}
        countSuffix={`/${stats.total}`}
        hasIcon={true}
      />
      
      {/* Add a new TaskStatCard for timed out tasks */}
      <TaskStatCard
        iconBgColor="bg-red-500"
        title="Timed Out"
        count={stats.timedOut || 0}
        hasIcon={true}
      />

      <AddTaskButton onClick={onAddTaskClick} />
    </div>
  );
}

// Make sure to export default the component
export default TaskStatistics;