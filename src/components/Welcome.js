// components/Welcome.js
import React from 'react';

export default function Welcome() {
  return (
    <div className="welcome-card">
      <h2 className="welcome-title">Welcome to DODO!</h2>
      <div className="welcome-content">
        <p>DODO is a gamified task management app that helps you:</p>
        <ul className="welcome-features">
          <li>Organize your daily tasks</li>
          <li>Track time spent on activities</li>
          <li>Earn points for completing tasks</li>
          <li>Visualize your productivity</li>
          <li>Build consistent habits</li>
        </ul>
        <div className="welcome-instructions">
          <p><strong>Getting Started:</strong></p>
          <p>1. Add tasks for today with estimated time requirements</p>
          <p>2. Use the timer to stay focused while working</p>
          <p>3. Complete tasks to earn points and unlock achievements</p>
          <p>4. Check your stats to see your progress</p>
        </div>
      </div>
    </div>
  );
}