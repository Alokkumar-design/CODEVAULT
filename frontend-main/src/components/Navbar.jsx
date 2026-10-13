import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav>
      {/* Brand Logo */}
      <Link to="/" className="nav-brand">
        <div className="brand-icon-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <h3>CodeVault</h3>
        <span className="nav-brand-badge">v1.2</span>
      </Link>

      {/* Center Search Input */}
      <div className="nav-center-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" placeholder="Type '/' to search repositories & issues..." />
        <span className="kbd-shortcut">Ctrl K</span>
      </div>

      {/* Right Navigation & User Profile */}
      <div className="nav-links">
        <Link
          to="/"
          className="nav-item"
          style={{
            color: location.pathname === "/" ? "#f0f6fc" : "#8b949e",
            fontWeight: location.pathname === "/" ? "600" : "500"
          }}
        >
          <span>Repositories</span>
        </Link>

        <Link to="/profile" className="user-profile-pill">
          <div className="avatar-circle">A</div>
          <span>alokkumar</span>
        </Link>

        <button
          className="btn-logout"
          onClick={() => {
            localStorage.clear();
            navigate("/auth");
          }}
        >
          Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
