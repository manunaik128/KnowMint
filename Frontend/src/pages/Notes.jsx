import React, { useState } from "react";
import "../styles/Notes.css";
import File from "../assets/file.png";

const notesData = [
  {
    id: 1,
    title: "Data Structures Notes",
    subject: "CS",
    semester: "Semester 3",
    size: "1.2 MB",
    date: "Apr 18, 2024",
  },
  {
    id: 2,
    title: "Organic Chemistry Notes",
    subject: "Chemistry",
    semester: "Semester 2",
    size: "1.5 MB",
    date: "Apr 18, 2024",
  },
  {
    id: 3,
    title: "Computer Networks Notes",
    subject: "CS",
    semester: "Semester 5",
    size: "1.4 MB",
    date: "Apr 18, 2024",
  },
  {
    id: 4,
    title: "Discrete Mathematics Notes",
    subject: "CS",
    semester: "Semester 3",
    size: "1 MB",
    date: "Apr 18, 2024",
  },
  {
    id: 5,
    title: "Machine Learning Notes",
    subject: "CS",
    semester: "Semester 6",
    size: "1.1 MB",
    date: "Apr 18, 2024",
  },
  {
    id: 6,
    title: "Microeconomics Unit 1",
    subject: "Economics",
    semester: "Semester 1",
    size: "1.1 MB",
    date: "Apr 18, 2024",
  },
];

const Notes = () => {
  const [search, setSearch] = useState("");

  const filteredNotes = notesData.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

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

        <button className="add-note">+ Add Note</button>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search my notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select>
          <option>Semester</option>
        </select>

        <select>
          <option>Subject</option>
        </select>

        <select>
          <option>Branch</option>
        </select>

        <select>
          <option>Sort by</option>
        </select>

      </div>

      {/* GRID */}
      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <div className="note-card" key={note.id}>

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
              </div>

              <p className="upload">
                Uploaded on {note.date} • {note.size}
              </p>

              <div className="actions">
                <button className="view">▶ View</button>
                <button className="share">Share</button>
                <button className="more">More</button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Notes;