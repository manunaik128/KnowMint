import React from "react";
import "../styles/Home.css";
import Back from "../assets/back.png";
import Access from "../assets/access.png";
import Hand from "../assets/hand.png";
import Tick from "../assets/tick.png";
import Search from "../assets/search.png";
import Upload from "../assets/upload.png";
import Explore from "../assets/explore.png";
import File from "../assets/file.png";

const Home = () => {
  return (
    <div>
      <div className="home">
        <div className="file-details">
          <div className="details">
            <div className="texts">
              <span id="main-txt">
                Study master with <br />
                shared notes. <br />
              </span>

              <br />
              <p id="paragraphs">
                Upload PDFs, organize them by semester and subject, 
                and quickly <br />find reliable study materials. Collaborate 
                with classmates and keep all <br />your notes in one place.
              </p>
            </div>
            <div className="btns">
              <button id="upload">Upload Notes</button>
              <button id="upload">Explore Liabrary</button>
            </div>
          </div>

          <div className="extra-details">
            <div className="border">
              <div className="subjects">
                <div className="text-icon">
                  <img src={Hand} alt="" />
                </div>
                <div className="icon-defination">
                  <span id="icon-details">Subject-wise organization</span>
                </div>
              </div>

              <div className="search">
                <div className="text-icon">
                  <img src={Search} alt="" />
                </div>
                <div className="icon-defination">
                  <span id="icon-details">Smart search and filters</span>
                </div>
              </div>
              <div className="share">
                <div className="text-icon">
                  <img src={Access} alt="" />
                </div>
                <div className="icon-defination">
                  <span id="icon-details">Share with classmates</span>
                </div>
              </div>
              <div className="access">
                <div className="text-icon">
                  <img src={Tick} alt="" />
                </div>
                <div className="icon-defination">
                  <span id="icon-details">Access anywhere</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="files-options">
          <div className="upload-opt">
            <div className="upload-pic">
              <img src={Upload} alt="" />

            </div>
            <div className="upload-text">
              <h3>Upload</h3> <br />
              <p id="paragraphs">
                Lorem ipsum dolor sit amet consectetur 
              </p> <br />
              <button id="upload">Upload Notes</button>
            </div>
            

          </div>

          <div className="upload-opt">
            <div className="upload-pic">
              <img src={File} alt="" />

            </div>
            <div className="upload-text">
              <h3>Upload</h3> <br />
              <p id="paragraphs">
                Lorem ipsum dolor sit amet consectetur 
              </p> <br />
              <button id="upload">Open Notes</button>
            </div>
          </div>

          <div className="upload-opt">
            <div className="upload-pic">
              <img src={Explore} alt="" />

            </div>
            <div className="upload-text">
              <h3>Explore</h3> <br />
              <p id="paragraphs">
                Lorem ipsum dolor sit amet consectetur 
              </p> <br />
              <button id="upload">Start Exploring</button>
            </div>
            

          </div>

        </div>

        
      </div>
    </div>
  );
};

export default Home;
