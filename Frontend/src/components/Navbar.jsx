import { useState } from "react";
import "../styles/Navbar.css";
import Logo from "../assets/logo.png";
import ProfileIcon from "../assets/profile.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully", "success");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="nav">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img src={Logo} alt="KnowMint logo" />
        </Link>
      </div>

      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menu */}
      <div className={`options ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/explore" onClick={() => setMenuOpen(false)}>
              Explore
            </Link>
          </li>

          <li>
            <Link to="/notes" onClick={() => setMenuOpen(false)}>
              My Notes
            </Link>
          </li>

          <li>
            <Link to="/assistant" onClick={() => setMenuOpen(false)}>
              Assistant
            </Link>
          </li>

          <li>
            <Link to="/upload" onClick={() => setMenuOpen(false)}>
              Upload
            </Link>
          </li>
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
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button id="login-btn">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;