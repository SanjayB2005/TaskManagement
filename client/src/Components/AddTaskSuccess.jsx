import React from "react";

function AddTaskSuccess({ onBack }) {
  const handleBackClick = () => {
    // Use onBack if provided, otherwise use window.history.back
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <article
      className="flex overflow-hidden flex-col items-center px-5 pb-5 text-center bg-white shadow-sm max-w-[315px] rounded-[30px]"
      role="alert"
      aria-live="polite"
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/645adb818df6b9d75ab813074e3dd14885468534a102a4b7ca72c639aa0d7041?placeholderIfAbsent=true&apiKey=35cc7236b4564ae693ad7ccf2b8c203d"
        alt="Task creation success illustration"
        className="object-contain mt-1 max-w-full aspect-square w-[100px]"
      />
      <h2 className="text-base font-medium leading-6 text-black">
        new task has been created <br />
        successfully
      </h2>
      <button
        className="self-stretch px-16 py-3.5 mt-3.5 text-sm font-semibold leading-snug text-white whitespace-nowrap bg-black rounded-xl border border-blue-600 border-solid shadow-[0px_4px_20px_rgba(0,110,233,0.05)]"
        onClick={handleBackClick}
        type="button"
      >
        Back
      </button>
    </article>
  );
}

export default AddTaskSuccess;