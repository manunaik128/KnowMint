import { useState } from "react";
import "../styles/Navbar.css";
import Logo from "../assets/logo.png";
import ProfileIcon from "../assets/profile.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div>
      <div className="nav">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="KnowMint logo" />
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
            <Link to="/assistant">
              <li>Assistant</li>
            </Link>
            <Link to="/upload">
              <li>Upload</li>
            </Link>
          </ul>

          {user ? (
            <div className="profile-menu">
              <button
                className="profile-btn"
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <img src={ProfileIcon} alt="Profile" />
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <p>Hello {user.name || "Guest"}</p>
                  <button
                    className="logout-btn"
                    type="button"
                    onClick={() => {
                      logout();
                      showToast("Logged out successfully", "success");
                      setDropdownOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button id="login-btn">
              <Link to="/login">Login</Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
