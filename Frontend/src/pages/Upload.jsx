import React, { useRef, useState } from "react";
import "../styles/Upload.css";
import Upload from "../assets/upload.png";

const UploadNotes = () => {

  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  /* CANCEL BUTTON FUNCTION */

  const handleCancel = () => {

    const confirmCancel = window.confirm(
      "Are you sure you want to clear all details?"
    );

    if (confirmCancel) {
      setTitle("");
      setSemester("");
      setSubject("");
      setBranch("");
      setFileName("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="upload-page">

      <div className="upload-container">

        <h1>Upload Notes</h1>

        <p className="subtitle">
          Share your study materials by uploading your notes. Tag them with the correct semester,
          subject and branch for better organization.
        </p>

        <div className="upload-content">

          {/* LEFT SIDE */}
          <div className="form-section">

            <label>Title</label>
            <input
              type="text"
              placeholder="Enter title of your notes..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="row">

              <div className="input-group">
                <label>Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Semester</option>
                  <option>1st Semester</option>
                  <option>2nd Semester</option>
                  <option>3rd Semester</option>
                </select>
              </div>

              <div className="input-group">
                <label>Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Subject</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>DBMS</option>
                  <option>C</option>
                </select>
              </div>

              <div className="input-group">
                <label>Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option value="">Branch</option>
                  <option>BCA</option>
                  <option>BSC</option>
                  <option>CS</option>
                </select>
              </div>

            </div>

            <div className="btn-row">
              <button className="upload-btn">Upload Note</button>

              <button
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>

            <p className="note">
              Please upload only educational materials in PDF format (max size: 20MB)
            </p>

          </div>


          {/* RIGHT SIDE */}
          <div className="upload-box">

            <img src={Upload} alt="upload" className="upload-icon" />

            <p>
              Drag & drop your PDF notes here or
              <span className="browse-text" onClick={handleBrowseClick}>
                {" "}browse files
              </span>
            </p>

            <button
              className="browse-btn"
              onClick={handleBrowseClick}
            >
              Browse Files
            </button>

            <input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {fileName && <p className="file-name">{fileName}</p>}

          </div>

        </div>

      </div>

    </div>
  );
};

export default UploadNotes;