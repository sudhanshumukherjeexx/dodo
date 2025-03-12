// components/InfoModal.js
import React from 'react';
import '../styles/InfoModal.css';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="info-modal">
        <div className="modal-header">
          <h2 className="modal-title">About DODO</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <p>DODO is a gamified task management app that helps you:</p>
          <ul className="info-features">
            <li>Organize your daily tasks</li>
            <li>Track time spent on activities</li>
            <li>Earn points for completing tasks</li>
            <li>Visualize your productivity</li>
            <li>Build consistent habits</li>
          </ul>
          <div className="info-instructions">
            <p><strong>Getting Started:</strong></p>
            <p>1. Add tasks for today with estimated time requirements</p>
            <p>2. Use the timer to stay focused while working</p>
            <p>3. Complete tasks to earn points and unlock achievements</p>
            <p>4. Check your stats to see your progress</p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="pixel-button" onClick={onClose}>Got it!</button>
        </div>
      </div>
    </div>
  );
}