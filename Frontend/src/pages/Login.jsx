import React from "react";
import "../styles/Login.css";
import Email from "../assets/email.png";
import Lock from "../assets/lock.png";
import Google from "../assets/google.png";
import Facebook from "../assets/facebook.png";

const Login = () => {
  return (
    <div className="login-page">

      <div className="login-card">

        <h1>
          Login to <span>KnowMint</span>
        </h1>

        <p className="subtitle">
          Access your notes and collaborate with classmates.
        </p>


        <div className="input-group">

          <label>Email</label>

          <div className="input-box">

            <div className="icon-box">
                          <img src={Email}  />
            </div>

            <input
              type="email"
              placeholder="Enter your email"
            />

          </div>

        </div>




        <div className="input-group">

          <div className="password-row">
            <label>Password</label>
            <a href="#">Forgot password?</a>
          </div>

          <div className="input-box">


            <div className="icon-box">
                          <img src={Lock}  />
            </div>

            <input
              type="password"
              placeholder="Enter your password"
            />

          </div>

        </div>



        <button className="login-btn">
          Login
        </button>


        <p className="signup-text">
          Don't have an account? <span>Sign up</span>
        </p>



        <div className="divider">
          <span>or continue with</span>
        </div>




        <div className="social-login">

          <button className="social-btn">

            <div className="social-icon">
                          <img src={Google}/>
            </div>

            Google

          </button>


          <button className="social-btn">

  
            <div className="social-icon">
              <img src={Facebook}/>
            </div>

            Facebook

          </button>

        </div>



        <p className="bottom-signup">
          Don't have an account? <span>Sign up</span>
        </p>

      </div>

    </div>
  );
};

export default Login;