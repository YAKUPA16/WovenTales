// Footer.js
import React from "react";
import "./Footer.css";
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Logo and Description */}
        <div className="footer-logo-section">
          <img src="/WovenTalesFinal.png" alt="WovenTales Logo" className="footer-logo" />
          <p>
            WovenTales is your creative hub for crafting, sharing, and exploring immersive branching stories.
          </p>
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
  );
};

export default Footer;
