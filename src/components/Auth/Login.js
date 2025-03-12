import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to sign in: ' + error.message);
    }
    
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <h2 className="pixel-title">LOGIN</h2>
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
        <button 
          disabled={loading} 
          type="submit" 
          className="pixel-button"
        >
          LOGIN
        </button>
      </form>
      <div className="auth-link">
        <Link to="/register" className="pixel-link">NEED AN ACCOUNT? REGISTER</Link>
      </div>
    </div>
  );
}