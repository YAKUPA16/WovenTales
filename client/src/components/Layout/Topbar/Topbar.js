import React from "react";
import "./Topbar.css";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <h1 className="topbar-title">Welcome Back!</h1>

      <button className="topbar-btn" onClick={() => navigate("/create-story")}>Start Writing</button>
    </header>
  );
}
