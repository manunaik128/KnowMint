import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyNotes } from "../services/notesService";
import { getNoteSummary, askNoteQuestion } from "../services/aiService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Assistant.css";
import Aiupload from "../assets/aiupload.png";
import Pdf from "../assets/pdf.png";

const Assistant = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);

  // Fetch user's notes on mount
  useEffect(() => {
    if (user) {
      fetchUserNotes();
    }
  }, [user]);

  const fetchUserNotes = async () => {
    try {
      const response = await getMyNotes();
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setSummary("");
    setAnswer("");
    toast.success(`Selected: ${note.title}`);
  };

  const handleSummarize = async () => {
    if (!selectedNote) {
      toast.error("Please select a note first");
      return;
    }

    setLoading(true);
    try {
      const response = await getNoteSummary(selectedNote._id, activeTab);
      setSummary(response.data.summary);
      toast.success("AI summary generated!");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error(error.response?.data?.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!selectedNote) {
      toast.error("Please select a note first");
      return;
    }
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setAskingQuestion(true);
    try {
      const response = await askNoteQuestion(selectedNote._id, question);
      setAnswer(response.data.answer);
      toast.success("AI answered your question!");
    } catch (error) {
      console.error("Error asking question:", error);
      toast.error(error.response?.data?.message || "Failed to get answer");
    } finally {
      setAskingQuestion(false);
    }
  };

  return (
    <div className="assistant-page">
      
      <div className="ai-notes-section">

        <div className="assistant-text">
          <h1>AI Notes <span>Assistant</span></h1>
          <p>
            Upload or select a PDF to get instant summaries, key points, and explanations.
          </p>
        </div>


        <div className="upload-option">

          <img src={Aiupload} alt="upload icon" />

          <h3>Upload Notes (PDF)</h3>

          <p className="drag-text">Upload notes to use AI features</p>

          <button
            onClick={() => navigate('/upload')}
            className="browse-btn"
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Go to Upload Page
          </button>

          <p className="limit-text">Supports PDF up to 20MB</p>

        </div>



        <div className="recent">

          <div className="recent-header">
            <h3>Recent Notes</h3>
            <a href="#">View All</a>
          </div>

          <div className="recent-view-notes">

            {notes.length === 0 && (
              <p className="no-notes">No uploaded notes yet</p>
            )}

            {notes.map((note) => (
              <div 
                className={`notes-card ${selectedNote?._id === note._id ? 'selected' : ''}`} 
                key={note._id}
                onClick={() => handleNoteSelect(note)}
              >
                <img src={Pdf} alt="pdf icon" />
                <div className="pdf-details">
                  <h4>{note.title}</h4>
                  <p>{note.branch} • {note.semester}</p>
                  <button onClick={(e) => { e.stopPropagation(); handleNoteSelect(note); }}>
                    Select
                  </button>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>


      <div className="ai-summary-section">

        <div className="summary-header">
          <h3>AI Summary <span className="beta">Beta</span></h3>
        </div>

        <div className="summary-file">
          <p>
            {selectedNote ? selectedNote.title : "No file selected"}
          </p>
          {selectedNote && <span className="change">Change</span>}
        </div>

        <div className="summary-tabs">
          <button 
            className={activeTab === 'summary' ? 'active' : ''}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={activeTab === 'keypoints' ? 'active' : ''}
            onClick={() => setActiveTab('keypoints')}
          >
            Key Points
          </button>
          <button 
            className={activeTab === 'flashcards' ? 'active' : ''}
            onClick={() => setActiveTab('flashcards')}
          >
            Flashcards
          </button>
        </div>

        {loading ? (
          <div className="loading-summary">
            <p>🤖 AI is analyzing your notes...</p>
            <p>This may take a few seconds</p>
          </div>
        ) : summary ? (
          <div className="chapter-summary">
            <h4>
              {activeTab === 'summary' ? 'AI Summary' : 
               activeTab === 'keypoints' ? 'Key Points' : 'Flashcards'}
            </h4>
            <div className="ai-content">
              {summary.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="chapter-summary">
            <h4>Select a note and click Generate to get AI insights</h4>
          </div>
        )}

        <button 
          className="ask-ai" 
          onClick={handleSummarize}
          disabled={loading || !selectedNote}
        >
          {loading ? 'Generating...' : `Generate ${activeTab === 'summary' ? 'Summary' : activeTab === 'keypoints' ? 'Key Points' : 'Flashcards'}`}
        </button>

        {/* Ask AI Question Section */}
        {selectedNote && (
          <div className="ask-question-section">
            <h4>Ask AI a Question</h4>
            <input
              type="text"
              placeholder="Type your question about this note..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button 
              className="submit-question"
              onClick={handleAskQuestion}
              disabled={askingQuestion || !question.trim()}
            >
              {askingQuestion ? 'Asking...' : 'Ask AI'}
            </button>
            {answer && (
              <div className="ai-answer">
                <h5>AI Answer:</h5>
                <div className="answer-content">
                  {answer.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default Assistant;