import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TaskList from './components/TaskList';
import Timer from './components/Timer';
import Analytics from './components/Analytics';
import Navigation from './components/Navigation';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './firebase';
import { collection, addDoc, doc, deleteDoc, updateDoc, getDocs, query, where, getDoc, setDoc } from 'firebase/firestore';
import './styles/App.css';

// Move PrivateRoute outside of App component
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Create a main content component that uses the auth context
function MainContent() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalTime: 0,
    dailyStats: {},
  });
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const { currentUser } = useAuth();
  
  // Load tasks from Firestore when user changes
  useEffect(() => {
    if (!currentUser) {
      // Reset state when user logs out
      setTasks([]);
      setStats({
        totalCompleted: 0,
        totalTime: 0,
        dailyStats: {},
      });
      return;
    }
    
    async function loadUserData() {
      try {
        // Load user stats
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.stats) {
            setStats(userData.stats);
          }
        }
        
        // Load user tasks
        const tasksQuery = query(collection(db, "users", currentUser.uid, "tasks"));
        const querySnapshot = await getDocs(tasksQuery);
        
        const loadedTasks = [];
        querySnapshot.forEach((doc) => {
          loadedTasks.push(doc.data());
        });
        
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
    
    loadUserData();
  }, [currentUser]);
  
  // Check for new day and move incomplete tasks
  useEffect(() => {
    if (!currentUser) return;
    
    const todayDate = new Date().toISOString().split('T')[0];
    
    if (todayDate !== currentDate) {
      setCurrentDate(todayDate);
      
      // Move yesterday's incomplete tasks to today
      const updatedTasks = tasks.map(task => {
        if (task.date === currentDate && !task.completed) {
          return { ...task, date: todayDate };
        }
        return task;
      });
      
      setTasks(updatedTasks);
      
      // Update tasks in Firestore
      updatedTasks.forEach(async (task) => {
        if (task.date === todayDate && !task.completed) {
          const taskDocRef = doc(db, "users", currentUser.uid, "tasks", task.id.toString());
          await updateDoc(taskDocRef, { date: todayDate });
        }
      });
    }
  }, [tasks, currentDate, currentUser]);
  
  // Add a new task
  const addTask = async (task) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newTaskId = Date.now();
    const newTask = {
      id: newTaskId,
      text: task.text,
      time: task.time,
      date: today,
      completed: false,
      points: calculatePoints(task.time),
    };
    
    // Add to local state
    setTasks([...tasks, newTask]);
    
    // Add to Firestore
    try {
      await setDoc(doc(db, "users", currentUser.uid, "tasks", newTaskId.toString()), newTask);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  
  // Delete a task
  const deleteTask = async (taskId) => {
    if (!currentUser) return;
    
    // Update local state
    setTasks(tasks.filter(task => task.id !== taskId));
    
    // Delete from Firestore
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "tasks", taskId.toString()));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  // Toggle task completion
  const toggleTask = async (taskId) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    let updatedTask = null;
    
    // Update local state
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const completed = !task.completed;
        
        // Update stats when completing a task
        if (completed && !task.completed) {
          updateStats(task);
        }
        
        updatedTask = { ...task, completed };
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    
    // Update in Firestore
    if (updatedTask) {
      try {
        const taskDocRef = doc(db, "users", currentUser.uid, "tasks", taskId.toString());
        await updateDoc(taskDocRef, { completed: updatedTask.completed });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };
  
  // Calculate points based on task time
  const calculatePoints = (time) => {
    // Convert time to minutes
    const minutes = parseInt(time, 10);
    // 1 point per minute, with bonuses for longer tasks
    if (minutes >= 60) return minutes * 1.5;
    if (minutes >= 30) return minutes * 1.2;
    return minutes;
  };
  
  // Update stats when a task is completed
  const updateStats = async (task) => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Create or update daily stats
    const dailyStats = stats.dailyStats[today] || { completed: 0, points: 0, time: 0 };
    
    const newDailyStats = {
      ...stats.dailyStats,
      [today]: {
        completed: dailyStats.completed + 1,
        points: dailyStats.points + task.points,
        time: dailyStats.time + parseInt(task.time, 10),
      }
    };
    
    const updatedStats = {
      totalCompleted: stats.totalCompleted + 1,
      totalTime: stats.totalTime + parseInt(task.time, 10),
      dailyStats: newDailyStats,
    };
    
    // Update local state
    setStats(updatedStats);
    
    // Update in Firestore
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { stats: updatedStats });
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  };
  
  // Filter tasks for today
  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.date === today && !task.completed);
  };
  
  // Get completed tasks
  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };
  
  // Get incomplete tasks from previous days
  const getBacklogTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.date !== today && !task.completed);
  };

  return (
    <div className="retro-app">
      <header className="pixel-header">
        <h1 className="glitch-text">DODO</h1>
        {currentUser && (
          <div className="score-display">
            SCORE: {Object.values(stats.dailyStats).reduce((sum, day) => sum + day.points, 0)}
          </div>
        )}
      </header>
      
      <Navigation />
      
      <div className="main-content">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <TaskList 
                  title="TODAY'S QUESTS"
                  tasks={getTodaysTasks()} 
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onAdd={addTask}
                />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/completed" 
            element={
              <PrivateRoute>
                <TaskList 
                  title="COMPLETED QUESTS"
                  tasks={getCompletedTasks()} 
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  showAdd={false}
                />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/backlog" 
            element={
              <PrivateRoute>
                <TaskList 
                  title="QUEST BACKLOG"
                  tasks={getBacklogTasks()} 
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  showAdd={false}
                />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/timer" 
            element={
              <PrivateRoute>
                <Timer />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <PrivateRoute>
                <Analytics stats={stats} />
              </PrivateRoute>
            } 
          />
          
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      
      <footer className="pixel-footer">
        <p>© {new Date().getFullYear()} RETRO TODO</p>
      </footer>
    </div>
  );
}

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </Router>
  );
}

export default App;