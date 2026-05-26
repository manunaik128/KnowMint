import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadNote } from "../services/notesService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Upload.css";
import Upload from "../assets/upload.png";

const UploadNotes = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading } = useAuth();
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log("Upload page - Auth check:", { user, loading });
    if (!loading && !user) {
      console.log("Upload page - Not authenticated, redirecting to login");
      toast.error("Please login to upload notes");
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate, toast]);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload only PDF files!");
        fileInputRef.current.value = "";
        return;
      }
      
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size should be less than 20MB!");
        fileInputRef.current.value = "";
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  /* UPLOAD BUTTON FUNCTION */

  const handleUpload = async () => {
    console.log("Upload button clicked");
    console.log("Current user:", user);
    console.log("Form data:", { title, semester, subject, branch, selectedFile });
    
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a title for your notes!");
      return;
    }
    if (!semester) {
      toast.error("Please select a semester!");
      return;
    }
    if (!subject) {
      toast.error("Please select a subject!");
      return;
    }
    if (!branch) {
      toast.error("Please select a branch!");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a PDF file to upload!");
      return;
    }

    console.log("Validation passed, starting upload...");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("semester", semester);
      formData.append("subject", subject);
      formData.append("branch", branch);
      formData.append("file", selectedFile);

      const response = await uploadNote(formData);
      
      console.log("Upload response:", response.data);
      toast.success(response.data.message || "Note uploaded successfully!");
      
      // Reset form
      setTitle("");
      setSemester("");
      setSubject("");
      setBranch("");
      setFileName("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      console.log("Form reset complete");
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Error response:", error.response);
      const message = error.response?.data?.message || "Failed to upload note. Please try again.";
      toast.error(message);
    } finally {
      setUploading(false);
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
                  <option>4rd Semester</option>
                  <option>5rd Semester</option>
                  <option>6rd Semester</option>
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
                  <option>PHP</option>
                  <option>Artificial Intelligence</option>
                  <option>FDS</option>
                  <option>CS</option>
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
                  <option>BBA</option>
                  <option>B.COM</option>
                  <option>CS IT</option>
            
                  
                </select>
              </div>

            </div>

            <div className="btn-row">
              <button 
                className="upload-btn" 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Note"}
              </button>

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