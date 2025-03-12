// components/Timer.js
import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

export default function Timer() {
  const [time, setTime] = useState(25 * 60); // Default 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [customTime, setCustomTime] = useState(25);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setIsActive(false);
      playAlarm();
    }
    
    return () => clearInterval(interval);
  }, [isActive, time]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTime(customTime * 60);
  };
  
  const handleCustomTimeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setCustomTime(value);
    setTime(value * 60);
  };
  
  const playAlarm = () => {
    const audio = new Audio('/alarm.mp3');
    audio.play();
  };
  
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="timer-container">
      <h2 className="pixel-title">QUEST TIMER</h2>
      
      <div className="timer-display">
        <div className="time-remaining">{formatTime(time)}</div>
      </div>
      
      <div className="timer-settings">
        <div className="time-selection">
          <label>SET TIME:</label>
          <select 
            value={customTime}
            onChange={handleCustomTimeChange}
            disabled={isActive}
            className="pixel-select"
          >
            <option value="5">5 MIN</option>
            <option value="10">10 MIN</option>
            <option value="15">15 MIN</option>
            <option value="25">25 MIN</option>
            <option value="30">30 MIN</option>
            <option value="45">45 MIN</option>
            <option value="60">60 MIN</option>
            <option value="90">90 MIN</option>
            <option value="120">120 MIN</option>
          </select>
        </div>
        
        <div className="timer-buttons">
          <button 
            onClick={toggleTimer} 
            className={`pixel-button ${isActive ? 'pause-button' : 'start-button'}`}
          >
            {isActive ? 'PAUSE' : 'START'}
          </button>
          <button 
            onClick={resetTimer} 
            className="pixel-button reset-button"
          >
            RESET
          </button>
        </div>
      </div>
      
      <div className="timer-info">
        <p>Focus on your quest!</p>
        <p>Complete to earn points!</p>
      </div>
    </div>
  );
};

