import React, { useState, useEffect } from "react";
import TaskStatCard from "./TaskStatCard";
import AddTaskButton from "./AddTaskButton";
import { fetchTasks } from "../services/api";
import image from '../assets/image.png';
import image2 from '../assets/image2.png';

function TaskStatistics({ onAddTaskClick, refreshTrigger }) {
  const [taskStats, setTaskStats] = useState({
    expired: 0,
    active: 0,
    completed: 0,
    total: 0
  });
  
  // Add a polling mechanism to check for updates regularly
  useEffect(() => {
    const getTaskStats = async () => {
      try {
        const tasks = await fetchTasks();
        
        const now = new Date();
        let expired = 0;
        let active = 0;
        let completed = 0;
        
        tasks.forEach(task => {
          if (task.status === 'Done') {
            completed++;
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
          total: tasks.length
        });
      } catch (error) {
        console.error("Error fetching task statistics:", error);
      }
    };
    
    // Initial fetch
    getTaskStats();
    
    // Set up polling to refresh stats every 3 seconds
    const intervalId = setInterval(() => {
      getTaskStats();
    }, 3000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refreshTrigger]); // refreshTrigger will trigger an immediate update when tasks are added

  return (
    <div className="h-[668px] min-w-60 w-[268px]">
      <TaskStatCard
        iconBgColor="bg-red-600"
        iconSrc="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/2b71e9ed77d23a8ed8b4707ffae22ae3df2fa6be3cf82848cefd922f0ed4e388?placeholderIfAbsent=true"
        title="Expired Tasks"
        count={taskStats.expired}
      />

      <TaskStatCard
        iconBgColor="bg-red-400"
        iconSrc={image}
        title="All Active Tasks"
        count={taskStats.active}
        hasIcon={true}
      />

      <TaskStatCard
        iconBgColor="bg-blue-400"
        title="Completed Tasks"
        iconSrc={image2}
        count={taskStats.completed}
        countSuffix={`/${taskStats.total}`}
        hasIcon={true}
      />

      <AddTaskButton onClick={onAddTaskClick} />
    </div>
  );
}

export default TaskStatistics;