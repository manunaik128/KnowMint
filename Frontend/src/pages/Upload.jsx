import React from "react";
import "../styles/Upload.css";

const Upload = () => {
  return (
    <div className="page">
      {/* Navbar */}

      {/* Upload Section */}
      <div className="container">
        <h1>Upload Notes</h1>
        <p className="desc">
          Share your study materials by uploading your notes. Tag them with the
          correct semester, subject and branch for better organization.
        </p>

        <div className="upload-box">
          <div className="upload-icon">📁</div>
          <p>
            Drag & drop your PDF notes here or <span>browse files</span>
          </p>
          <button className="browse-btn">Browse Files</button>
        </div>

        {/* Form */}
        <div className="form">
          <input type="text" placeholder="Enter title of your notes..." />

          <div className="row">
            <select>
              <option>Select Semester</option>
            </select>

            <select>
              <option>Select Subject</option>
            </select>

            <select>
              <option>Select Branch</option>
            </select>
          </div>

          <div className="buttons">
            <button className="upload-btn">Upload Note</button>
            <button className="cancel-btn">Cancel</button>
          </div>

          <p className="note">
            Please upload only educational materials in PDF format (max size:
            20MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;