import React, { useRef, useState } from 'react';
import { signup } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const fileRef = useRef(null);
  const navigate = useNavigate();

  /* ================= IMAGE UPLOAD LOGIC ================= */
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /* ================= NORMAL SIGNUP ================= */
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

  /* ================= GOOGLE SIGNUP ================= */
  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google';
    // 🔁 Replace URL with your backend Google OAuth endpoint
  };

  /* ================= GITHUB SIGNUP ================= */
  const handleGithubSignup = () => {
    window.location.href = 'http://localhost:5000/auth/github';
    // 🔁 Replace URL with your backend GitHub OAuth endpoint
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* ================= LEFT FORM ================= */}
        <div className="auth-form-section">


          <h2 className="brand-title">Welcome to WovenTales</h2>
          <div className="woven-container">
  <img src="/WovenTalesFinal.png" alt="logo" className="woven" />
</div>
          <p className="subtitle">
            Unleash your imagination. Collaborate, explore, and create branching stories.
          </p>

          {/* ===== IMAGE UPLOAD UI ===== */}
          <div className="avatar-upload">
            <div className="avatar-circle">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" />
              ) : (
                '👤'
              )}
            </div>

            <button
              type="button"
              className="upload-btn"
              onClick={() => fileRef.current.click()}
            >
              Upload Image
            </button>

            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={handleImageSelect}
            />
          </div>

          {error && <p className="error">{error}</p>}

          {/* ===== FORM ===== */}
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

          <div className="divider">Or continue with</div>

          {/* ===== SOCIAL LOGIN ===== */}
          <div className="social-buttons">
            <button className="social-btn" onClick={handleGoogleSignup}>
              Google
            </button>

            <button className="social-btn" onClick={handleGithubSignup}>
              GitHub
            </button>
          </div>

          <p className="login-text">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>Log in</span>
          </p>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
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
