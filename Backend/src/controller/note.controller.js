import noteModel from "../models/note.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

// Upload a new note
export const uploadNoteController = async (req, res) => {
  try {
    console.log("Upload request received:", {
      body: req.body,
      file: req.file ? { 
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        bufferLength: req.file.buffer ? req.file.buffer.length : 'no buffer'
      } : null,
      user: req.user,
    });

    const { title, semester, subject, branch } = req.body;

    // Validate required fields
    if (!title || !semester || !subject || !branch) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ 
        message: "Title, semester, subject, and branch are required." 
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log("Validation failed - no file");
      return res.status(400).json({ 
        message: "Please upload a PDF file." 
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      console.log("Validation failed - not authenticated");
      return res.status(401).json({ 
        message: "Authentication required. Please login." 
      });
    }

    let fileUrl;
    
    // Try Cloudinary first
    console.log("Attempting Cloudinary upload...");
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'knowmint/notes',
            resource_type: 'raw',
            public_id: `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9-_.]/g, '')}`,
            flags: 'attachment'
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log("Cloudinary upload success:", result.secure_url);
              resolve(result);
            }
          }
        );
        
        stream.on('error', (error) => {
          console.error("Stream error:", error);
          reject(error);
        });
        
        stream.end(req.file.buffer);
      });

      fileUrl = uploadResult.secure_url;
      console.log("File uploaded to Cloudinary successfully");
    } catch (cloudinaryError) {
      // Fallback to local storage
      console.warn("Cloudinary failed, falling back to local storage:", cloudinaryError.message);
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      const filepath = path.join(uploadsDir, filename);
      
      fs.writeFileSync(filepath, req.file.buffer);
      fileUrl = `/uploads/${filename}`;
      console.log("File saved to local storage:", fileUrl);
    }

    // Format file size
    const fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";

    console.log("Creating note in database...");
    // Create note
    const note = await noteModel.create({
      title,
      semester,
      subject,
      branch,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      fileSize,
      uploadedBy: req.user.id,
      uploaderName: req.user.name,
    });

    console.log("Note created successfully:", note._id);

    res.status(201).json({
      message: "Note uploaded successfully!",
      note,
    });
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Error stack:", error.stack);
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
      .select("-fileUrl"); // Don't expose file URL publicly

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

    // Check if user owns this note
    if (note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "You can only download your own notes." 
      });
    }

    // Increment download count
    note.downloads += 1;
    await note.save();

    // Check if it's a Cloudinary URL or local file
    if (note.fileUrl.includes('cloudinary')) {
      // Redirect to Cloudinary URL
      res.redirect(note.fileUrl);
    } else {
      // Local file - send download
      const filename = note.fileUrl.split('/').pop();
      const filepath = path.join(uploadsDir, filename);
      
      if (!fs.existsSync(filepath)) {
        return res.status(404).json({ message: "File not found on server." });
      }
      
      res.download(filepath, note.fileName);
    }
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

    // Delete file - check if it's Cloudinary or local
    if (note.fileUrl.includes('cloudinary')) {
      // Extract public_id from Cloudinary URL for deletion
      try {
        const urlParts = note.fileUrl.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const publicId = `knowmint/notes/${fileNameWithExtension.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log("File deleted from Cloudinary");
      } catch (cloudinaryError) {
        console.error("Error deleting from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    } else {
      // Local file - delete from disk
      const filename = note.fileUrl.split('/').pop();
      const filepath = path.join(uploadsDir, filename);
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log("File deleted from local storage");
      }
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
