import React, { useState, useEffect } from "react";
import { getPublicNotes, downloadNote } from "../services/notesService";
import { useToast } from "../context/ToastContext";
import "../styles/Explore.css";

function Explore() {
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    semester: "",
    subject: "",
    branch: "",
    sort: "",
  });

  // Fetch notes on component mount and when filters change
  useEffect(() => {
    fetchNotes();
  }, [filters]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getPublicNotes(filters);
      setNotes(response.data.notes);
    } catch (error) {
      toast.error("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
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
      
      toast.success("📥 Download started!");
    } catch (error) {
      toast.error("Failed to download note. Please try again.");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <div className="container">

      <h1>Explore Shared Notes</h1>
      <p className="subtitle">
        Discover quality study materials shared by students across semesters and subjects.
      </p>

      {/* Filters */}

      <div className="filters">
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

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
          <option value="">Most recent</option>
          <option value="rating">Highest rated</option>
          <option value="downloads">Most downloaded</option>
        </select>
      </div>

      {/* Notes Cards */}

      {loading ? (
        <div className="loading">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="no-notes">No notes found. Be the first to upload!</div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div className="card" key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.branch} • {note.semester}</p>
              <p className="author">Uploaded by {note.uploaderName}</p>

              <div className="card-bottom">
                <span>⭐ {note.rating.toFixed(1)}</span>
                <span>⬇ {note.downloads} downloads</span>
                <button onClick={() => handleDownload(note._id, note.title)}>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Explore;