// components/FirstTimePrompt.js
import React from 'react';
import '../styles/FirstTimePrompt.css';

export default function FirstTimePrompt({ isVisible, onClose, onOpenInfo }) {
  if (!isVisible) return null;
  
  return (
    <div className="first-time-prompt">
      <p>Welcome to DODO! Click the <span className="info-icon">ℹ️</span> icon to learn how to use the app.</p>
      <div className="prompt-buttons">
        <button className="pixel-button" onClick={onOpenInfo}>Show Info</button>
        <button className="pixel-button close-prompt" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}