// components/TaskList.js
import React, { useState } from 'react';
import '../styles/TaskList.css';

export default function TaskList({ title, tasks, onToggle, onDelete, onAdd, showAdd = true }) {
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(30);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    onAdd({ text: newTask, time: newTaskTime });
    setNewTask('');
    setNewTaskTime(30);
  };
  
  return (
    <div className="task-list-container">
      <h2 className="pixel-title">{title}</h2>
      
      {showAdd && (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="pixel-input"
            placeholder="NEW QUEST..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            maxLength={50}
          />
          <div className="time-select">
            <label>TIME:</label>
            <select 
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              className="pixel-select"
            >
              <option value="5">5 MIN</option>
              <option value="10">10 MIN</option>
              <option value="15">15 MIN</option>
              <option value="30">30 MIN</option>
              <option value="45">45 MIN</option>
              <option value="60">1 HOUR</option>
              <option value="90">1.5 HOURS</option>
              <option value="120">2 HOURS</option>
            </select>
          </div>
          <button type="submit" className="pixel-button add-button">ADD</button>
        </form>
      )}
      
      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="empty-list">NO QUESTS HERE!</li>
        ) : (
          tasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <span className="task-text">{task.text}</span>
                <div className="task-meta">
                  <span className="task-time">{task.time} MIN</span>
                  <span className="task-points">+{Math.round(task.points)} PTS</span>
                </div>
              </div>
              <div className="task-actions">
                <button 
                  onClick={() => onToggle(task.id)} 
                  className="pixel-button action-button"
                >
                  {task.completed ? 'UNDO' : 'COMPLETE'}
                </button>
                <button 
                  onClick={() => onDelete(task.id)} 
                  className="pixel-button action-button delete-button"
                >
                  DELETE
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

