import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Email from "../assets/email.png";
import Lock from "../assets/lock.png";
import Google from "../assets/google.png";
import Facebook from "../assets/facebook.png";
import { loginUser, registerUser } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setMessage("");
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Login form submitted", { isSignup, formData });
    setLoading(true);
    setMessage("");

    try {
      const response = isSignup
        ? await registerUser({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          })
        : await loginUser({
            email: formData.email.trim(),
            password: formData.password,
          });

      console.log("Login/Signup response:", response.data);
      
      const profile = response.data?.user;
      const token = response.data?.token;
      
      if (profile) {
        console.log("Calling login function with:", { profile, token });
        login(profile, token);
        showToast(isSignup ? "Signup successful" : "Login successful", "success");
        
        // Redirect after successful login
        setTimeout(() => {
          console.log("Redirecting to home page");
          navigate("/", { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Unable to authenticate. Please try again.";
      showToast(errorMessage, "error");
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          {isSignup ? "Create an account" : "Login to"} <span>KnowMint</span>
        </h1>

        <p className="subtitle">
          {isSignup
            ? "Signup to save your notes and collaborate with classmates."
            : "Access your notes and collaborate with classmates."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <label>Name</label>
              <div className="input-box">
                <div className="icon-box">
                  <img src={Google} alt="Name icon" />
                </div>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your name"
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <div className="input-box">
              <div className="icon-box">
                <img src={Email} alt="Email icon" />
              </div>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="password-row">
              <label>Password</label>
              {!isSignup && <a href="#">Forgot password?</a>}
            </div>
            <div className="input-box">
              <div className="icon-box">
                <img src={Lock} alt="Lock icon" />
              </div>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (isSignup ? "Signing up..." : "Logging in...") : isSignup ? "Sign up" : "Login"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="signup-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={toggleMode} className="auth-switch">
            {isSignup ? "Login" : "Sign up"}
          </span>
        </p>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <div className="social-login">
          <button className="social-btn" type="button">
            <div className="social-icon">
              <img src={Google} alt="Google" />
            </div>
            Google
          </button>

          <button className="social-btn" type="button">
            <div className="social-icon">
              <img src={Facebook} alt="Facebook" />
            </div>
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;