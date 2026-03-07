import React, { useState } from "react";
import "../styles/Assistant.css";
import Aiupload from "../assets/aiupload.png";
import Pdf from "../assets/pdf.png";

const Assistant = () => {

  const [notes, setNotes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    const newNote = {
      name: file.name,
      semester: "Uploaded File"
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedFile(file.name);
  };

  return (
    <div className="assistant-page">

      {/* LEFT SECTION */}
      <div className="ai-notes-section">

        <div className="assistant-text">
          <h1>AI Notes <span>Assistant</span></h1>
          <p>
            Upload or select a PDF to get instant summaries, key points, and explanations.
          </p>
        </div>

        {/* Upload Box */}

        <div className="upload-option">

          <img src={Aiupload} alt="upload icon" />

          <h3>Upload Notes (PDF)</h3>

          <p className="drag-text">or drag & drop here</p>

          <input
            type="file"
            accept="application/pdf"
            id="fileUpload"
            hidden
            onChange={handleUpload}
          />

          <label htmlFor="fileUpload" className="browse-btn">
            Browse Files
          </label>

          <p className="limit-text">Supports PDF up to 20MB</p>

        </div>


        {/* Recent Notes */}

        <div className="recent">

          <div className="recent-header">
            <h3>Recent Notes</h3>
            <a href="#">View All</a>
          </div>

          <div className="recent-view-notes">

            {notes.length === 0 && (
              <p className="no-notes">No uploaded notes yet</p>
            )}

            {notes.map((note, index) => (
              <div className="notes-card" key={index}>

                <img src={Pdf} alt="pdf icon" />

                <div className="pdf-details">
                  <h4>{note.name}</h4>
                  <p>{note.semester}</p>
                  <button>Summarize</button>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>


      {/* RIGHT SIDE PANEL */}

      <div className="ai-summary-section">

        <div className="summary-header">
          <h3>AI Summary <span className="beta">Beta</span></h3>
        </div>

        <div className="summary-file">
          <p>
            {selectedFile ? selectedFile : "No file selected"}
          </p>
          <span className="change">Change</span>
        </div>

        <div className="summary-tabs">
          <button className="active">Summary</button>
          <button>Key Points</button>
          <button>Flashcards</button>
        </div>

        <div className="chapter-summary">

          <h4>Chapter-wise Summary</h4>

          <ul>
            <li>
              <b>Arrays & Linked Lists</b>
              <p>Arrays: Types, operations, complexity</p>
              <p>Linked Lists: Implementation, types</p>
            </li>

            <li>
              <b>Stacks & Queues</b>
              <p>LIFO, FIFO concepts</p>
              <p>Applications & examples</p>
            </li>

            <li>
              <b>Trees & Graphs</b>
              <p>Tree traversal (DFS, BFS)</p>
              <p>Graph representation</p>
            </li>

          </ul>

        </div>

        <button className="ask-ai">Ask AI a Question</button>

      </div>

    </div>
  );
};

export default Assistant;