import React from "react";
import "../styles/Navbar.css";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="nav">
        <div className="logo">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>

        <div className="options">
          <ul>
            <Link to="/explore">
              <li>Explore</li>
            </Link>
            <Link to="/notes">
              <li>My Notes</li>
            </Link>
            <Link to="/upload">
              <li>Upload</li>
            </Link>
          </ul>

          <button id="login-btn">
            <Link to="/login">Login</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
