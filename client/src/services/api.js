const API_URL = import.meta.env.VITE_SERVER_URI || 'http://localhost:8000';

export const fetchTasks = async () => {
  try {
    console.log("Fetching tasks from:", `${API_URL}/todos`);
    const response = await fetch(`${API_URL}/todos`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API: Fetched tasks successfully:", data);
    return data;
  } catch (error) {
    console.error("API: Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    console.log("API: Creating task with data:", taskData);
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API: Task created:", data);
    return data;
  } catch (error) {
    console.error("API: Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, updateData) => {
  try {
    console.log("API: Updating task:", id, updateData);
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API: Task updated:", data);
    return data;
  } catch (error) {
    console.error("API: Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    console.log("API: Deleting task:", id);
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok && response.status !== 204) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log("API: Task deleted successfully");
  } catch (error) {
    console.error("API: Error deleting task:", error);
    throw error;
  }
};

export const checkTimeoutTasks = async (maxDurationMinutes = 1440) => {
  try {
    console.log("API: Checking for timed-out tasks");
    const response = await fetch(`${API_URL}/todos/check-timeout?maxDuration=${maxDurationMinutes}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API: Timeout check results:", data);
    return data;
  } catch (error) {
    console.error("API: Error checking for timed-out tasks:", error);
    throw error;
  }
};