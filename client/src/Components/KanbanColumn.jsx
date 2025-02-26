import React from "react";
import TaskCard from "./TaskCard";

function KanbanColumn({ title, count, tasks, dotColor, dividerSrc, onTaskUpdated }) {
  // Determine status based on column title
  const getStatusFromTitle = () => {
    switch(title) {
      case "To Do": return "To Do";
      case "On Progress": return "On Progress";
      case "Done": return "Done";
      default: return "";
    }
  };

  const columnStatus = getStatusFromTitle();

  return (
    <div className="flex flex-col items-center px-5 py-5 bg-gray-200 rounded-xl max-w-[354px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <div className="flex gap-2 justify-between items-center self-stretch px-1.5 w-full">
        <div className="flex gap-2.5 items-center">
          <span className={`flex shrink-0 self-stretch my-auto w-4 h-4 ${dotColor} rounded-full`} />
          <div className="flex gap-2.5 items-center self-stretch my-auto text-lg font-bold tracking-tighter text-zinc-900">
            <h2>{title}</h2>
            <div className="flex justify-center items-center px-2.5 py-1.5 text-xs leading-none whitespace-nowrap bg-gray-100 rounded-2xl min-w-6 min-h-6">
              <span>{count}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start mt-7 w-full">
        <div className="self-stretch">
          <img src={dividerSrc} className="w-full h-px object-cover" alt="" />
        </div>
        <div className="flex flex-col gap-[15px] mt-10 w-full">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              deadline={task.deadline}
              status={columnStatus}
              onTaskUpdated={onTaskUpdated}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default KanbanColumn;