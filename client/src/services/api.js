const API_URL = import.meta.env.VITE_SERVER_URI || 'http://localhost:8000';

export const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_URL}/todos`);
    const data = await response.json();
    console.log("API: Fetched tasks:", data); // Debug log
    return data;
  } catch (error) {
    console.error("API: Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    console.log("API: Creating task with data:", taskData); // Debug log
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    const data = await response.json();
    console.log("API: Task created:", data); // Debug log
    return data;
  } catch (error) {
    console.error("API: Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, updateData) => {
  try {
    console.log("API: Updating task:", id, updateData); // Debug log
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API: Task updated successfully:", data); // Debug log
    return data;
  } catch (error) {
    console.error("API: Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    console.log("API: Deleting task:", id); // Debug log
    await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error("API: Error deleting task:", error);
    throw error;
  }
};


// Add this function to your api.js file

export const checkTimeoutTasks = async (maxDurationMinutes = 1440) => {
  try {
    console.log("API: Checking for timed-out tasks");
    const response = await fetch(`${API_URL}/todos/check-timeout?maxDuration=${maxDurationMinutes}`);
    
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API: Timeout check results:", data);
    return data;
  } catch (error) {
    console.error("API: Error checking for timed-out tasks:", error);
    throw error;
  }
};