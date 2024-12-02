import React, { useState, useEffect } from 'react';
import './Todo.css';

function Todo() {
  const [task, setTask] = useState("");  // Task input state
  const [tasks, setTasks] = useState([]); // Array of tasks
  const [filter, setFilter] = useState("all"); // Filter state for showing tasks
  const [error, setError] = useState(""); // State for handling error messages

  // Load tasks from localStorage when the app starts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add a task to the list
  const addTask = () => {
    // Check if the task already exists
    const taskExists = tasks.some((existingTask) => existingTask.text.toLowerCase() === task.toLowerCase());

    if (taskExists) {
      setError("Task already exists!");
    } else {
      if (task) {
        const newTask = { id: Date.now(), text: task, completed: false };
        setTasks([...tasks, newTask]);
        setTask("");  // Clear input field
        setError("");  // Clear any previous error messages
      }
    }
  };

  // Delete a task from the list
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Filter tasks based on completion status
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  // Clear all tasks
  const clearAllTasks = () => {
    if (window.confirm("Are you sure you want to delete all tasks?")) {
      setTasks([]);
    }
  };

  return (
    <div className="todo">
      <h1>To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Show "Nothing to preview" message when no tasks */}
      {tasks.length === 0 ? (
        <p className="nothing-to-preview">Nothing to preview</p>
      ) : (
        // Show the task filters and delete buttons only if there are tasks
        <div className="task-filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("active")}>Active</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={clearAllTasks}>Delete All</button>
        </div>
      )}

      {/* Task List */}
      {tasks.length > 0 && (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <span>{task.text}</span>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Todo;
