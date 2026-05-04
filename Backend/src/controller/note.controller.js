import noteModel from "../models/note.model.js";
import fs from "fs";
import path from "path";

// Upload a new note
export const uploadNoteController = async (req, res) => {
  try {
    console.log("Upload request received:", {
      body: req.body,
      file: req.file,
      user: req.user,
    });

    const { title, semester, subject, branch } = req.body;

    // Validate required fields
    if (!title || !semester || !subject || !branch) {
      return res.status(400).json({ 
        message: "Title, semester, subject, and branch are required." 
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        message: "Please upload a PDF file." 
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: "Authentication required. Please login." 
      });
    }

    // Format file size
    const fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";

    // Create note
    const note = await noteModel.create({
      title,
      semester,
      subject,
      branch,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize,
      uploadedBy: req.user.id,
      uploaderName: req.user.name,
    });

    res.status(201).json({
      message: "Note uploaded successfully!",
      note,
    });
  } catch (error) {
    console.error("Upload error:", error);
    // Delete uploaded file if database operation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Failed to upload note.",
      error: error.message,
    });
  }
};

// Get all public notes (for Explore page)
export const getAllPublicNotesController = async (req, res) => {
  try {
    const { semester, subject, branch, search, sort } = req.query;

    // Build filter
    const filter = { isPublic: true };

    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (branch) filter.branch = branch;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Build sort options
    let sortOptions = {};
    if (sort === "rating") {
      sortOptions = { rating: -1 };
    } else if (sort === "downloads") {
      sortOptions = { downloads: -1 };
    } else {
      sortOptions = { createdAt: -1 }; // Default: most recent
    }

    const notes = await noteModel
      .find(filter)
      .sort(sortOptions)
      .select("-filePath"); // Don't expose file path publicly

    res.status(200).json({
      message: "Notes retrieved successfully.",
      notes,
      count: notes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve notes.",
      error: error.message,
    });
  }
};

// Get user's own notes (for My Notes page)
export const getUserNotesController = async (req, res) => {
  try {
    const { semester, subject, branch, search, sort } = req.query;

    // Build filter
    const filter = { uploadedBy: req.user.id };

    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (branch) filter.branch = branch;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Build sort options
    let sortOptions = {};
    if (sort === "date") {
      sortOptions = { createdAt: 1 };
    } else if (sort === "name") {
      sortOptions = { title: 1 };
    } else {
      sortOptions = { createdAt: -1 }; // Default: most recent first
    }

    const notes = await noteModel
      .find(filter)
      .sort(sortOptions);

    res.status(200).json({
      message: "Your notes retrieved successfully.",
      notes,
      count: notes.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve your notes.",
      error: error.message,
    });
  }
};

// Get a single note by ID
export const getNoteByIdController = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve note.",
      error: error.message,
    });
  }
};

// Download a note
export const downloadNoteController = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if file exists
    if (!fs.existsSync(note.filePath)) {
      return res.status(404).json({ message: "File not found on server." });
    }

    // Increment download count
    note.downloads += 1;
    await note.save();

    // Send file
    res.download(note.filePath, note.fileName);
  } catch (error) {
    res.status(500).json({
      message: "Failed to download note.",
      error: error.message,
    });
  }
};

// Delete a note
export const deleteNoteController = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if user owns this note
    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "You can only delete your own notes." 
      });
    }

    // Delete file from server
    if (fs.existsSync(note.filePath)) {
      fs.unlinkSync(note.filePath);
    }

    // Delete from database
    await noteModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Note deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete note.",
      error: error.message,
    });
  }
};

// Update note visibility
export const updateNoteVisibilityController = async (req, res) => {
  try {
    const { isPublic } = req.body;
    const note = await noteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if user owns this note
    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "You can only modify your own notes." 
      });
    }

    note.isPublic = isPublic;
    await note.save();

    res.status(200).json({
      message: "Note visibility updated successfully.",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update note visibility.",
      error: error.message,
    });
  }
};

// Rate a note
export const rateNoteController = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating must be between 1 and 5." 
      });
    }

    const note = await noteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Update rating (average)
    const totalRating = note.rating * note.ratingCount + rating;
    note.ratingCount += 1;
    note.rating = (totalRating / note.ratingCount).toFixed(1);

    await note.save();

    res.status(200).json({
      message: "Note rated successfully.",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to rate note.",
      error: error.message,
    });
  }
};
