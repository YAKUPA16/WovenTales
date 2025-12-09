// This component manages new account creation. It collects user details, validates that both
// passwords match and sends the signup request to the backend. After successful signup, the
// user is redirected to the login page, where they will receive a JWT token upon logging in.
// Although the signup itself does not generate a JWT, it enables the user to obtain one later.
// The JWT will then be used by axiosInstance to authenticate all protected routes automatically.

import React, { useState } from 'react';
import { signup } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup({ username, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* LEFT FORM */}
        <div className="auth-form-section">
          <h2 className="brand-title">Welcome to WovenTales</h2>
          <div className="woven-container">
            <img src="/WovenTalesFinal.png" alt="logo" className="woven" />
          </div>
          <p className="subtitle">
            Unleash your imagination. Collaborate, explore, and create branching stories.
          </p>

          {error && <p className="error">{error}</p>}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Your Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="primary-btn">
              Create Account
            </button>
          </form>

          <p className="login-text">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>Log in</span>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="auth-image-section">
          <img src="/signupp.jpg" alt="illustration" />
          <h3>Dive into Infinite Stories</h3>
          <p>
            Collaborate, explore, and create worlds where every choice matters.
            Your adventure begins here.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;
