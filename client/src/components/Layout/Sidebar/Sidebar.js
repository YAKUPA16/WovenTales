import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { 
  AiFillHome, 
  AiFillStar, 
  AiOutlineSearch, 
  AiOutlineFolderOpen, 
  AiOutlineSetting, 
  AiOutlineUser, 
  AiOutlineEdit, 
  AiOutlineBook 
} from "react-icons/ai";

export default function Sidebar() {
  const token = localStorage.getItem("token");

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src="/WovenTalesFinal.png" alt="logo" className="circle-logo" />
        <div className="logo-text">
          <div className="logo-title">WovenTales</div>
          <div className="logo-sub">Where stories grow together</div>
        </div>
      </div>

      {/* Menu Items */}
      <ul className="menu">
        <li><Link to="/"><AiFillHome className="icon"/> Home</Link></li>
        <li><Link to="/editor"><AiOutlineEdit className="icon"/> Create Story</Link></li>
        <li><Link to="/"><AiOutlineBook className="icon"/> My Stories</Link></li>
        <li><Link to="/"><AiFillStar className="icon"/> Favorites</Link></li>
        <li><Link to="/blogs"><AiOutlineBook className="icon"/> Blog</Link></li>
        <li><Link to="/"><AiOutlineSearch className="icon"/> Search</Link></li>
        <li><Link to="/"><AiOutlineFolderOpen className="icon"/> Explore</Link></li>
        <li><Link to="/profile"><AiOutlineUser className="icon"/> Profile</Link></li>
        <li><Link to="/editor"><AiOutlineSetting className="icon"/> Settings</Link></li>

        {!token && (
          <>
            <li><Link to="/signup"><AiOutlineUser className="icon"/> Signup</Link></li>
            <li><Link to="/login"><AiOutlineUser className="icon"/> Login</Link></li>
          </>
        )}
        {token && (
          <li>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>

      <div className="sidebar-footer">© {new Date().getFullYear()} WovenTales</div>
    </aside>
  );
}
