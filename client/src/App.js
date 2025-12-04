import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import Topbar from "./components/Layout/Topbar/Topbar";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard.js";
import StoryEditor from "./components/Story/StoryEditor/StoryEditor";
import ProfilePage from "./components/Profile/ProfilePage";
import BlogList from "./components/Blog/BlogList";
import BlogPage from "./components/Blog/BlogPage";
import BlogEditor from "./components/Blog/BlogEditor";

// Auth Components
import Login from "./components/Profile/Login";
import Signup from "./components/Profile/Signup";
import AuthLanding from "./components/Profile/AuthLanding";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      {token ? (
        // Logged-in layout with sidebar + topbar
        <div className="app-container" style={{ display: "flex" }}>
          <Sidebar setToken={setToken} />
          <main style={{ flex: 1 }}>
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/editor" element={<StoryEditor />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:id" element={<BlogPage />} />
              <Route path="/blogs/write" element={<BlogEditor />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      ) : (
        // Public routes: Landing / Login / Signup
        <Routes>
          <Route path="/" element={<AuthLanding />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} /> {/* signup does NOT set token */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}
