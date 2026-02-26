import React from "react";
import Navbar from "../components/Navbar";
import "../styles/Home.css";
import Background from "../assets/back.png";
import Notes from "../assets/notes.png";
import Upload from "../assets/upload.png"
import Explore from "../assets/explore.png"
import File from "../assets/file.png"

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="home">
        <div className="text">
          <div className="welcome">
            <img src={Notes} alt="" />
            <h1>Welcome to KnowMint</h1>
          </div>

          <div className="quote">
            <p id="details">
              Empower your learning by sharing and accessing quality notes.
              Discover, upload, and organize notes across all semesters. Access
              reliable study materials anytime, anywhere you need. Collaborate
              with peers and simplify your academic journey. Upload PDFs easily
              and reach students across branches. One platform to explore,
              share, and grow knowledge. Find subject-wise notes faster with
              smart search tools.
            </p>
          </div>

          <div className="option-btn">
            <div className="upload-notes">
              <div className="upload">
                <img src={Upload} alt="" />
              </div>
              <div className="txt">
              <span id="content-text">Upload</span>
              </div>
            </div>
            <div className="my-notes">
              <div className="notes">
                 <img src={File} alt="" />
              </div>
                 <div className="txt">
              <span id="content-text">My Notes</span>
              </div>
            </div>

            <div className="explore-notes">
              <div className="explore">
               <img src={Explore} alt="" />
               </div>
                  <div className="txt">
              <span id="content-text">Explore</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
