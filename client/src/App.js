import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import Sidebar from "./components/Layout/Sidebar/Sidebar";
import Topbar from "./components/Layout/Topbar/Topbar";
import Footer from "./components/Layout/Footer/Footer";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard.js";
import ProfilePage from "./components/Profile/ProfilePage";
import BlogList from "./components/Blog/BlogList";
import BlogPage from "./components/Blog/BlogPage";
import BlogEditor from "./components/Blog/BlogEditor";
import ReaderPage from "./pages/ReaderPage/ReaderPage";
import StoryCreater from "./pages/StoryCreation/StoryCreater";
import MyStories from "./pages/MyStories/MyStories";
import ExplorePage from "./pages/ExplorePage/ExplorePage";

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
        <div className="app-container" style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar setToken={setToken} />
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Topbar />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blogs/:id" element={<BlogPage />} />
                <Route path="/blogs/write" element={<BlogEditor />} />
                <Route path="/reader/:storyId" element={<ReaderPage />} />
                <Route path="/create-story" element={<StoryCreater />} />
                <Route path="/my-stories" element={<MyStories />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <Footer />
          </main>
        </div>
      ) : (
        // Public routes: Landing / Login / Signup
        <Routes>
          <Route path="/" element={<AuthLanding />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}
