import React from "react";

function AddTaskButton({ onClick }) {
  return (
    <button
      className="flex gap-1.5 justify-center items-center py-4 pr-3.5 pl-3 mt-4 w-full text-sm font-medium leading-none text-white rounded-2xl bg-slate-900 min-h-12"
      onClick={onClick}
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/35cc7236b4564ae693ad7ccf2b8c203d/185b5fd35304bb66affe384b84181360962d14412f54ceadac44bdbff178232a?placeholderIfAbsent=true"
        className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
        alt="Add icon"
      />
      <span className="self-stretch my-auto">Add Task</span>
    </button>
  );
}

export default AddTaskButton;