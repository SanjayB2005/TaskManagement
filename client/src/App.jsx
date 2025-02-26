import React from "react";
import TaskDashboard from "./Components/TaskDashboard";

function App() {

  // console.log(import.meta.env.VITE_SERVER_URI);

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskDashboard />
      
    </div>
  );
}

export default App;