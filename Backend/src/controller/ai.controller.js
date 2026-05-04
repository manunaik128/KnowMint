import noteModel from "../models/note.model.js";
import { extractTextFromPDFLimited } from "../services/pdfExtractor.service.js";
import { getAISummary, askAIQuestion } from "../services/gemini.service.js";

// Get AI summary of a note
export const getNoteSummaryController = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { type = 'summary' } = req.query; // summary, keypoints, flashcards

    // Find the note
    const note = await noteModel.findById(noteId);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if user has access (either owner or public note)
    if (!note.isPublic && note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You don't have access to this note." });
    }

    // Extract text from PDF
    console.log("Extracting text from PDF:", note.filePath);
    const textContent = await extractTextFromPDFLimited(note.filePath, 50000);
    
    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ 
        message: "Could not extract text from this PDF. It might be scanned or image-based." 
      });
    }

    // Get AI summary
    console.log("Generating AI summary...");
    const summary = await getAISummary(textContent, type);

    res.status(200).json({
      message: "AI summary generated successfully.",
      summary,
      note: {
        id: note._id,
        title: note.title,
        type,
      }
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({
      message: "Failed to generate AI summary.",
      error: error.message,
    });
  }
};

// Ask AI a question about a note
export const askNoteQuestionController = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required." });
    }

    // Find the note
    const note = await noteModel.findById(noteId);
    
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if user has access
    if (!note.isPublic && note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You don't have access to this note." });
    }

    // Extract text from PDF
    console.log("Extracting text for Q&A:", note.filePath);
    const textContent = await extractTextFromPDFLimited(note.filePath, 50000);
    
    if (!textContent || textContent.trim().length === 0) {
      return res.status(400).json({ 
        message: "Could not extract text from this PDF." 
      });
    }

    // Get AI answer
    console.log("Asking AI question...");
    const answer = await askAIQuestion(textContent, question);

    res.status(200).json({
      message: "AI response generated successfully.",
      answer,
      question,
      note: {
        id: note._id,
        title: note.title,
      }
    });
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).json({
      message: "Failed to get AI response.",
      error: error.message,
    });
  }
};

// Quick summary on upload (auto-generate when uploading)
export const quickSummaryOnUpload = async (noteId) => {
  try {
    const note = await noteModel.findById(noteId);
    if (!note) return;

    const textContent = await extractTextFromPDFLimited(note.filePath, 30000);
    if (!textContent) return;

    // Generate a brief summary in background
    const summary = await getAISummary(textContent, 'summary');
    
    // You could save this to database if needed
    console.log("Quick summary generated for note:", noteId);
    return summary;
  } catch (error) {
    console.error("Error generating quick summary:", error);
  }
};
