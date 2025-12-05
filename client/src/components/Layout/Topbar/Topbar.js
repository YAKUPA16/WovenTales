import React from "react";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p>Some search bar exists....</p>
      </div>

      <div className="topbar-right">
        <button className="btn-blue">Start Writing</button>
        <img src="/avatar.png" alt="avatar" className="avatar" />
      </div>
    </header>
  );
}