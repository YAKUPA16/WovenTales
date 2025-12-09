// components/Profile/AuthLanding.js
// This is the public landing page shown before login. It does not use JWT because it is
// accessible to all users. The component displays the platform's introduction, hero section,
// features, story categories, how-it-works steps, contact info, embedded map, and footer.
// It mainly serves as a visually rich entry point that guides users toward Login or Signup,
// using React Router navigation

import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthLanding.css";
import heroIllustration from "../../assets/hero.jpeg"; 
import {
  Puzzle,
  Trees,
  BookOpen,
  User,
  Star,
  Search,
  MessageCircle,
  Cpu,
  Lock,
  Lightbulb, Edit3, Share2,
} from "lucide-react";
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
export default function AuthLanding() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* NAVBAR */}
      <nav className="nav">
        <img src="/WovenTalesFinal.png" className="nav-img" alt="header" />
        <div className="nav-logo">WovenTales</div>
        <div className="nav-actions">
          <button onClick={() => navigate("/login")} className="nav-btn">Login</button>
          <button onClick={() => navigate("/signup")} className="nav-btn primary">Signup</button>
        </div>
      </nav>

      {/* HERO SECTION */}
<section
  className="hero"
  style={{
    backgroundImage: `url(${heroIllustration})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
>
  <div className="hero-overlay">
    <div className="hero-left">
      <h1>
        Turn Your Stories Into Worlds<br />
        Where Imagination Knows No Limits
      </h1>
      <p>
        Welcome to <strong>WovenTales</strong> — the ultimate platform for storytellers to craft branching narratives, share immersive tales, and connect with a community that brings your stories to life.
      </p>

      <div className="hero-buttons" style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
        
        <div>
          <p style={{ marginBottom: "8px", fontWeight: "600" }}>Ready to bring your stories alive?</p>
          <button className="primary" onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>

        <div>
          <p style={{ marginBottom: "8px", fontWeight: "600" }}>Already a member?</p>
          <button className="secondary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

      </div>

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#f0f0f0" }}>
        Join hundreds of creators and explore limitless storytelling possibilities.
      </p>
    </div>
  </div>
</section>


      {/* ABOUT SECTION */}
<section className="about">
  <img src="/WovenTalesFinal.png" className="about-img" alt="About" />
  <div className="about-text">
    <h2>About WovenTales</h2>
    <p>
      <strong>WovenTales</strong> is a next-generation storytelling platform designed for creators, writers, and enthusiasts alike. Whether you’re an aspiring author or a seasoned storyteller, our platform empowers you to craft immersive, branching narratives that respond to reader choices.
    </p>
    <p>
      Explore a variety of <strong>story spheres</strong>, from fantasy realms and thrilling action to microcosms of everyday life. Connect and collaborate with a vibrant community, share your work, and receive meaningful feedback to refine your craft.
    </p>
    <p>
      With intuitive tools for <strong>interactive story creation</strong>, personalized reader experiences, and community-driven discovery, WovenTales transforms ideas into living worlds, where every decision creates a new adventure. Join us and let your imagination take flight.
    </p>
  </div>
</section>

      {/* CREATIVE POTENTIAL */}
<section className="creative">
  <h2>Unlock Your Creative Potential</h2>
  <div className="creative-grid">

    <div className="creative-box">
      <Puzzle className="creative-icon" />
      <h3>Interactive Story Builder</h3>
      <p>Craft your narrative with intuitive, hands-on tools.</p>
    </div>

    <div className="creative-box">
      <Trees className="creative-icon" />
      <h3>Branching Scene Architecture</h3>
      <p>Design complex branching storylines with ease.</p>
    </div>

    <div className="creative-box">
      <BookOpen className="creative-icon" />
      <h3>Immersive Reader Mode</h3>
      <p>Experience stories from the reader's perspective seamlessly.</p>
    </div>

    <div className="creative-box">
      <User className="creative-icon" />
      <h3>Comprehensive User Profiles</h3>
      <p>Showcase your work and track your creative journey.</p>
    </div>

    <div className="creative-box">
      <Star className="creative-icon" />
      <h3>Constructive Feedback & Ratings</h3>
      <p>Receive professional insights to refine your stories.</p>
    </div>

    <div className="creative-box">
      <Search className="creative-icon" />
      <h3>Advanced Search & Filters</h3>
      <p>Quickly discover stories and collaborators that match your interests.</p>
    </div>

    <div className="creative-box">
      <MessageCircle className="creative-icon" />
      <h3>Community & Blog Hub</h3>
      <p>Engage with fellow writers and share ideas.</p>
    </div>

    <div className="creative-box">
      <Cpu className="creative-icon" />
      <h3>AI-Powered Recommendations</h3>
      <p>Get tailored suggestions for story ideas and branching paths.</p>
    </div>

    <div className="creative-box">
      <Lock className="creative-icon" />
      <h3>Secure & Reliable Accounts</h3>
      <p>Protect your creative work with robust account security.</p>
    </div>

  </div>
</section>

     {/* STORY SPHERES */}
<section className="story-section">
  <h2>Explore Diverse Story Spheres</h2>
  <div className="story-grid">
    
    <div className="story-item">
      <h3>Fantasy Realms</h3>
      <img src="/fantasyy.jpg" className="story-card" alt="Fantasy Realms" />
    </div>

    <div className="story-item">
      <h3>Sci-Fi Frontiers</h3>
      <img src="/scifi.jpg" className="story-card" alt="Sci-Fi Frontiers" />
    </div>

    <div className="story-item">
      <h3>Mystery & Thrillers</h3>
      <img src="/mytery.jpg" className="story-card" alt="Mystery & Thrillers" />
    </div>

    <div className="story-item">
      <h3>Historical Sagas</h3>
      <img src="/history.jpg" className="story-card" alt="Historical Sagas" />
    </div>

    <div className="story-item">
      <h3>Romantic Escapades</h3>
      <img src="/romance.jpg" className="story-card" alt="Romantic Escapades" />
    </div>

    <div className="story-item">
      <h3>Young Adult Adventures</h3>
      <img src="/fantasy.jpg" className="story-card" alt="Young Adult Adventures" />
    </div>

    <div className="story-item">
      <h3>Microcosms & Tiny Worlds</h3>
      <img src="/tinyworld.jpg" className="story-card" alt="Microcosms & Tiny Worlds" />
    </div>

    <div className="story-item">
      <h3>Thrilling Action</h3>
      <img src="/action.jpg" className="story-card" alt="Thrilling Action" />
    </div>

  </div>
</section>

{/* HOW IT WORKS */}
<section className="how">
  <h2>How WovenTales Works</h2>
  <div className="how-grid">

    <div className="how-step">
      <Lightbulb className="how-icon" />
      <h3>1. Ideate Your Story</h3>
      <p>Start by brainstorming ideas and creating the core concept of your story. Think about characters, setting, and key events.</p>
    </div>

    <div className="how-step">
      <Edit3 className="how-icon" />
      <h3>2. Build & Branch</h3>
      <p>Use WovenTales’ intuitive editor to craft branching narratives, scenes, and decision points. Easily visualize your story structure.</p>
    </div>

    <div className="how-step">
      <Share2 className="how-icon" />
      <h3>3. Share & Explore</h3>
      <p>Publish your story to the community. Readers can explore your branching paths, provide feedback, and enjoy immersive storytelling.</p>
    </div>

  </div>
</section>


     {/* CONTACT */}
<section className="contact">
  <h2>Get in Touch</h2>

  <div className="contact-info">
    <p><strong>Address:</strong> FAST‑NUCES Lahore, Faisal Town, Lahore, Punjab, Pakistan</p>
    <p><strong>Email:</strong> contact@woventales.com</p>
    <p><strong>Phone No:</strong> +92 321 1234567</p>
    <button className="contact-btn" onClick={() => window.location = "mailto:contact@woventales.com"}>
      Contact Support
    </button>

    <div className="map-container">
      <iframe
        title="FAST NUCES Lahore Location"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1812.0!2d74.30345!3d31.48105!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391901d0c3f65db7%3A0x0!2sFAST‑NUCES%20Lahore%20Campus!5e0!3m2!1sen!2s!4v0000000000000"
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "12px", marginTop: "20px" }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  </div>
</section>

{/* FOOTER */}
<footer className="footer">
  <div className="footer-content">

    {/* Logo and Description */}
    <div className="footer-logo-section">
      <img src="/WovenTalesFinal.png" alt="WovenTales Logo" className="footer-logo" />
      <p>
        WovenTales is your creative hub for crafting, sharing, and exploring immersive branching stories.
      </p>
    </div>

    {/* Quick Links */}
    <div className="footer-links">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="/signup">Sign Up</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>

    {/* Social Media */}
    <div className="footer-social">
      <h4>Follow Us</h4>
      <div className="social-icons">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={28} />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF size={28} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={28} />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedinIn size={28} />
        </a>
      </div>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© 2025 WovenTales — All Rights Reserved.</p>
  </div>
</footer>


    </div>
  );
}
