// components/Analytics.js
// Updated layout for horizontal alignment
import React from 'react';
import '../styles/Analytics.css';

export default function Analytics({ stats }) {
  const today = new Date().toISOString().split('T')[0];
  const todayStats = stats.dailyStats[today] || { completed: 0, points: 0, time: 0 };
  
  // Calculate streak (consecutive days with completed tasks)
  const calculateStreak = () => {
    const dates = Object.keys(stats.dailyStats).sort();
    let streak = 0;
    
    if (dates.length === 0) return 0;
    
    // Check if today has completed tasks
    if (todayStats.completed > 0) {
      streak = 1;
      
      // Check previous days
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      for (let i = 1; i <= 30; i++) { // Check up to 30 days back
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateString = checkDate.toISOString().split('T')[0];
        
        if (stats.dailyStats[dateString] && stats.dailyStats[dateString].completed > 0) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };
  
  // Last 7 days productivity
  const getLast7Days = () => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayStats = stats.dailyStats[dateString] || { completed: 0, points: 0, time: 0 };
      
      result.push({
        date: dateString,
        label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        ...dayStats
      });
    }
    return result.reverse();
  };
  
  const last7Days = getLast7Days();
  const streak = calculateStreak();
  const totalPoints = Object.values(stats.dailyStats).reduce((sum, day) => sum + day.points, 0);
  
  // Calculate player level (1 level per 100 points)
  const level = Math.floor(totalPoints / 100) + 1;
  const nextLevelPoints = level * 100;
  const levelProgress = (totalPoints % 100) / 100;
  
  return (
    <div className="analytics-container">
      <h2 className="pixel-title">YOUR STATS</h2>
      
      {/* Stats Overview Cards - Horizontally aligned */}
      <div className="stats-overview">
        <div className="stat-card">
          <h3>LEVEL</h3>
          <div className="stat-value">{level}</div>
          <div className="level-progress">
            <div 
              className="level-bar" 
              style={{ width: `${levelProgress * 100}%` }}
            ></div>
          </div>
          <div className="level-text">{totalPoints} / {nextLevelPoints} XP</div>
        </div>
        
        <div className="stat-card">
          <h3>TODAY</h3>
          <div className="stat-value">{todayStats.completed}</div>
          <div className="stat-label">QUESTS</div>
          <div className="stat-sub">{todayStats.time} MINUTES</div>
        </div>
        
        <div className="stat-card">
          <h3>STREAK</h3>
          <div className="stat-value">{streak}</div>
          <div className="stat-label">DAYS</div>
          <div className="stat-sub">KEEP IT UP!</div>
        </div>
        
        <div className="stat-card">
          <h3>TOTAL</h3>
          <div className="stat-value">{stats.totalCompleted}</div>
          <div className="stat-label">QUESTS</div>
          <div className="stat-sub">{Math.round(stats.totalTime / 60)} HOURS</div>
        </div>
      </div>
      
      {/* Weekly Progress Chart */}
      <div className="weekly-progress">
        <h3 className="section-title">LAST 7 DAYS</h3>
        <div className="chart-container">
          {last7Days.map((day) => (
            <div key={day.date} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ height: `${Math.min(day.completed * 20, 100)}%` }}
              ></div>
              <div className="bar-label">{day.label}</div>
              <div className="bar-value">{day.completed}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="achievement-section">
        <h3 className="section-title">ACHIEVEMENTS</h3>
        <div className="achievements-list">
          <div className={`achievement ${stats.totalCompleted >= 1 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🏆</div>
            <div className="achievement-info">
              <div className="achievement-name">FIRST QUEST</div>
              <div className="achievement-desc">Complete your first task</div>
            </div>
          </div>
          
          <div className={`achievement ${stats.totalCompleted >= 10 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">⚔️</div>
            <div className="achievement-info">
              <div className="achievement-name">ADVENTURER</div>
              <div className="achievement-desc">Complete 10 quests</div>
            </div>
          </div>
          
          <div className={`achievement ${streak >= 3 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🔥</div>
            <div className="achievement-info">
              <div className="achievement-name">ON FIRE</div>
              <div className="achievement-desc">3-day streak</div>
            </div>
          </div>
          
          <div className={`achievement ${level >= 5 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🌟</div>
            <div className="achievement-info">
              <div className="achievement-name">HERO</div>
              <div className="achievement-desc">Reach level 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}