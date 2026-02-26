import React from "react";
import "../styles/Navbar.css";
import Logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <div>
      <div className="nav">
        <div className="logo">
          <img src={Logo} />
        </div>

        <div className="options">
          <ul>
            <li>Explore</li>
            <li>My Notes</li>
            <li>Upload</li>
          </ul>

          <button id="login-btn">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
