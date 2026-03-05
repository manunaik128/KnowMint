import React from "react";
import "../styles/Assistant.css";
import Aiupload from "../assets/aiupload.png";
import Pdf from "../assets/pdf.png";

const Assistant = () => {
  return (
    <div>
      <div className="assistant-page">
        <div className="ai-notes-section">
          <div className="assitant-text">
            <span id="main-txt">AI Notes Assistant</span> <br />
            <p id="paragraphs">
              Upload or Select a PDF to get instant summaries,key points,and
              explanation.
            </p>
          </div>
          <div className="upload-option">
            <div className="upload-image">
              <img src={Aiupload} alt="" />
            </div>
            <span id="upload-info">Upload Notes (PDF)</span> <br />
            <button id="browse">Browse Files</button>
          </div>

          <div className="recent">
            <div className="texts">
              <p>Recent Notes</p>
              <a href="">View All</a>
            </div>
            <div className="recent-view-notes">
              <div className="notes-summarize">
                <div className="pdf-image">
                  <img src={Pdf} alt="" />
                </div>

                <div className="pdf-details">
                  <h4>Data Structure</h4>
                  <p>cs ' sem3</p>
                  <button id="summarize">Summarize</button>
                </div>
              </div>
 <div className="notes-summarize">
                <div className="pdf-image">
                  <img src={Pdf} alt="" />
                </div>

                <div className="pdf-details">
                  <h4>Data Structure</h4>
                  <p>cs ' sem3</p>
                  <button id="summarize">Summarize</button>
                </div>
              </div>

               <div className="notes-summarize">
                <div className="pdf-image">
                  <img src={Pdf} alt="" />
                </div>

                <div className="pdf-details">
                  <h4>Data Structure</h4>
                  <p>cs ' sem3</p>
                  <button id="summarize">Summarize</button>
                </div>
              </div>

               <div className="notes-summarize">
                <div className="pdf-image">
                  <img src={Pdf} alt="" />
                </div>

                <div className="pdf-details">
                  <h4>Data Structure</h4>
                  <p>cs ' sem3</p>
                  <button id="summarize">Summarize</button>
                </div>
              </div>

            </div>
            
          </div>
        </div>

        <div className="ai-summary-section">hggf</div>
      </div>
    </div>
  );
};

export default Assistant;
