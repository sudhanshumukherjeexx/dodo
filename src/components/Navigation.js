import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navigation.css';

export default function Navigation() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  return (
    <nav className="pixel-nav">
      {currentUser ? (
        <>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            TODAY
          </NavLink>
          <NavLink to="/backlog" className={({ isActive }) => isActive ? 'active' : ''}>
            BACKLOG
          </NavLink>
          <NavLink to="/completed" className={({ isActive }) => isActive ? 'active' : ''}>
            DONE
          </NavLink>
          <NavLink to="/timer" className={({ isActive }) => isActive ? 'active' : ''}>
            TIMER
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
            STATS
          </NavLink>
          <button onClick={handleLogout} className="nav-button">
            LOGOUT
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
            LOGIN
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>
            REGISTER
          </NavLink>
        </>
      )}
    </nav>
  );
}