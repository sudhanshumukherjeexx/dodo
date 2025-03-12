import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    }
    
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <h2 className="pixel-title">REGISTER</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>EMAIL</label>
          <input 
            type="email" 
            className="pixel-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>PASSWORD</label>
          <input 
            type="password" 
            className="pixel-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>CONFIRM PASSWORD</label>
          <input 
            type="password" 
            className="pixel-input"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)} 
            required 
          />
        </div>
        <button 
          disabled={loading} 
          type="submit" 
          className="pixel-button"
        >
          REGISTER
        </button>
      </form>
      <div className="auth-link">
        <Link to="/login" className="pixel-link">ALREADY HAVE AN ACCOUNT? LOGIN</Link>
      </div>
    </div>
  );
}