import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getMyNotes, deleteNote, downloadNote } from "../services/notesService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Notes.css";
import File from "../assets/file.png";

const Notes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    semester: "",
    subject: "",
    branch: "",
    sort: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user's notes on component mount and when filters change
  useEffect(() => {
    if (user) {
      console.log("Fetching notes for user:", user);
      fetchNotes();
    }
  }, [search, filters, refreshTrigger, user]);

  // Listen for refresh signal from upload page
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("Refresh triggered from upload page");
      setRefreshTrigger(prev => prev + 1);
    }
  }, [location.state]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      console.log("Fetching notes with filters:", { search, ...filters });
      const response = await getMyNotes({
        search,
        ...filters,
      });
      console.log("Notes received:", response.data.notes);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load your notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = async (noteId, noteTitle) => {
    try {
      const response = await downloadNote(noteId);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${noteTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download note.");
    }
  };

  const handleDelete = async (noteId, noteTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${noteTitle}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteNote(noteId);
      toast.success("Note deleted successfully!");
      fetchNotes(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete note. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="notes-container">

      {/* HEADER */}
      <div className="notes-header">
        <h1>My Notes</h1>
        <p>
          Organize and access your uploaded notes. Keep your study materials tidy and well-labeled.
        </p>
      </div>

      {/* CONTROLS */}
      <div className="notes-controls">

        <button className="add-note" onClick={() => navigate("/upload")}>
          + Add Note
        </button>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search my notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          value={filters.semester}
          onChange={(e) => handleFilterChange("semester", e.target.value)}
        >
          <option value="">Semester</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="3rd Semester">3rd Semester</option>
          <option value="4th Semester">4th Semester</option>
          <option value="5th Semester">5th Semester</option>
          <option value="6th Semester">6th Semester</option>
          <option value="7th Semester">7th Semester</option>
          <option value="8th Semester">8th Semester</option>
        </select>

        <select 
          value={filters.subject}
          onChange={(e) => handleFilterChange("subject", e.target.value)}
        >
          <option value="">Subject</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="DBMS">DBMS</option>
          <option value="C">C</option>
          <option value="Data Structures">Data Structures</option>
          <option value="Algorithms">Algorithms</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Physics">Physics</option>
          <option value="Mathematics">Mathematics</option>
        </select>

        <select 
          value={filters.branch}
          onChange={(e) => handleFilterChange("branch", e.target.value)}
        >
          <option value="">Branch</option>
          <option value="BCA">BCA</option>
          <option value="BSC">BSC</option>
          <option value="CS">CS</option>
          <option value="IT">IT</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Electrical">Electrical</option>
        </select>

        <select 
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="date">Date (Oldest)</option>
          <option value="name">Name (A-Z)</option>
        </select>

      </div>

      {/* GRID */}
      {loading ? (
        <div className="loading">Loading your notes...</div>
      ) : notes.length === 0 ? (
        <div className="no-notes">
          No notes found. Upload your first note!
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div className="note-card" key={note._id}>

              {/* ICON */}
              <div className="note-icon">
                <img src={File} alt="file" />
              </div>

              {/* CONTENT */}
              <div className="note-content">
                <h3>{note.title}</h3>

                <p className="meta">
                  {note.subject} • {note.semester}
                </p>

                <div className="tags">
                  <span>{note.semester}</span>
                  <span>{note.subject}</span>
                  <span>{note.branch}</span>
                </div>

                <p className="upload">
                  Uploaded on {formatDate(note.createdAt)} • {note.fileSize}
                </p>

                <div className="actions">
                  <button className="view" onClick={() => handleDownload(note._id, note.title)}>
                    ▶ View
                  </button>
                  <button className="share">Share</button>
                  <button className="more" onClick={() => handleDelete(note._id, note.title)}>
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Notes;