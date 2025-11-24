import React from "react";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h1>Welcome back ✨</h1>
        <p>Continue exploring or create a new story.</p>
      </div>

      <div className="topbar-right">
        <button className="btn-blue">Start Writing</button>
        <img src="/avatar.png" alt="avatar" className="avatar" />
      </div>
    </header>
  );
}