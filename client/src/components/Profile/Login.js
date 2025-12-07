import React, { useState } from "react";
import { login } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  // Email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Simple password regex: at least 6 characters
  const passwordRegex = /^.{6,}$/;

  const validateForm = () => {
    if (!emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setValidationError("Password must be at least 6 characters long.");
      return false;
    }
    if (!termsAccepted) {
      setValidationError("You must accept the Terms of Service and Privacy Policy.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = await login({ email, password });

      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* LEFT SIDE */}
        <div className="login-left">
          <div className="logo">WovenTales</div>
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="subtitle">Login to your account</p>

          {error && <p className="error">{error}</p>}
          {validationError && <p className="error">{validationError}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <label>Email or Username</label>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555"
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

           <div class="terms-row">
  <input
    type="checkbox"
    id="terms"
    checked={termsAccepted}
    onChange={(e) => setTermsAccepted(e.target.checked)}
  />
  <label for="terms">
     I agree to the <span>Terms & Conditions</span> and <span>Privacy Policy</span>
  </label>
</div>

            <button type="submit" className="login-btn">
              Log In
            </button>
          </form>

          <h3 className="signup-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </h3>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="login-right">
          <img src="/loginW.jpg" alt="illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
