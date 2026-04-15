import React from "react";
import "../styles/Explore.css";

function Explore() {
  return (
    <div className="container">

      <h1>Explore Shared Notes</h1>
      <p className="subtitle">
        Discover quality study materials shared by students across semesters and subjects.
      </p>

      {/* Filters */}

      <div className="filters">

        <input type="text" placeholder="Search notes..." />

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
          <option>Most recent</option>
        </select>

      </div>

      {/* Notes Cards */}

      <div className="notes-grid">

        <div className="card">
          <h3>Data Structures Notes</h3>
          <p>CS • Semester 3</p>
          <p className="author">Uploaded by Rahul</p>

          <div className="card-bottom">
            <span>⭐ 4.8</span>
            <span>⬇ 320 downloads</span>
            <button>View</button>
          </div>
        </div>

        <div className="card">
          <h3>Organic Chemistry Notes</h3>
          <p>Chemistry • Semester 2</p>
          <p className="author">Uploaded by Priya</p>

          <div className="card-bottom">
            <span>⭐ 4.7</span>
            <span>⬇ 210 downloads</span>
            <button>View</button>
          </div>
        </div>

        <div className="card">
          <h3>Thermodynamics Notes</h3>
          <p>Mechanical • Semester 4</p>
          <p className="author">Uploaded by Amit</p>

          <div className="card-bottom">
            <span>⭐ 4.9</span>
            <span>⬇ 410 downloads</span>
            <button>View</button>
          </div>
        </div>
          <div className="card">
          <h3>Thermodynamics Notes</h3>
          <p>Mechanical • Semester 4</p>
          <p className="author">Uploaded by Amit</p>

          <div className="card-bottom">
            <span>⭐ 4.9</span>
            <span>⬇ 410 downloads</span>
            <button>View</button>
          </div>
        </div>
          <div className="card">
          <h3>Thermodynamics Notes</h3>
          <p>Mechanical • Semester 4</p>
          <p className="author">Uploaded by Amit</p>

          <div className="card-bottom">
            <span>⭐ 4.9</span>
            <span>⬇ 410 downloads</span>
            <button>View</button>
          </div>
        </div>
          <div className="card">
          <h3>Thermodynamics Notes</h3>
          <p>Mechanical • Semester 4</p>
          <p className="author">Uploaded by Amit</p>

          <div className="card-bottom">
            <span>⭐ 4.9</span>
            <span>⬇ 410 downloads</span>
            <button>View</button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Explore;