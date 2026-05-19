import noteModel from "../models/note.model.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import https from "https";
import http from "http";

// Helper: upload buffer to Cloudinary with retry on timeout
const uploadToCloudinary = (buffer, options, retries = 2) => {
  return new Promise((resolve, reject) => {
    const attempt = (attemptsLeft) => {
      console.log(`Cloudinary upload attempt (${3 - attemptsLeft}/3)...`);

      const stream = cloudinary.uploader.upload_stream(
        {
          ...options,
          timeout: 120000, // 120 second timeout
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            if (attemptsLeft > 0 && (error.http_code === 499 || error.message?.includes('Timeout'))) {
              console.log(`Retrying upload... (${attemptsLeft} attempts left)`);
              setTimeout(() => attempt(attemptsLeft - 1), 2000);
            } else {
              reject(error);
            }
          } else {
            resolve(result);
          }
        }
      );

      stream.on('error', (err) => {
        console.error("Stream error:", err);
        reject(err);
      });

      stream.end(buffer);
    };

    attempt(retries);
  });
};

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

    if (!title || !semester || !subject || !branch) {
      return res.status(400).json({ 
        message: "Title, semester, subject, and branch are required." 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: "Please upload a PDF file." 
      });
    }

    const fileSizeMB = req.file.size / (1024 * 1024);
    console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);

    const fileNameWithoutExt = path.parse(req.file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, '') || 'note';
    const publicId = `${Date.now()}-${fileNameWithoutExt}`;

    console.log("Uploading to Cloudinary as resource_type: raw ...");

    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      folder: 'knowmint/notes',
      resource_type: 'raw',   // PDFs must use 'raw', not 'auto'
      public_id: publicId,
      use_filename: false,
      overwrite: false,
    });

    console.log("Cloudinary upload success:", uploadResult.secure_url);

    const fileUrl = uploadResult.secure_url;
    const fileSize = fileSizeMB.toFixed(2) + " MB";

    const note = await noteModel.create({
      title,
      semester,
      subject,
      branch,
      fileName: req.file.originalname,
      fileUrl,
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

    // Friendly message for timeout specifically
    if (error.http_code === 499 || error.message?.includes('Timeout')) {
      return res.status(504).json({
        message: "Upload timed out. Please try with a smaller PDF (under 5MB) or check your internet connection.",
        error: error.message,
      });
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

    const filter = { isPublic: true };
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (branch) filter.branch = branch;
    if (search) filter.title = { $regex: search, $options: "i" };

    let sortOptions = {};
    if (sort === "rating") sortOptions = { rating: -1 };
    else if (sort === "downloads") sortOptions = { downloads: -1 };
    else sortOptions = { createdAt: -1 };

    const notes = await noteModel.find(filter).sort(sortOptions);

    res.status(200).json({
      message: "Notes retrieved successfully.",
      notes,
      count: notes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve notes.", error: error.message });
  }
};

// Get user's own notes (for My Notes page)
export const getUserNotesController = async (req, res) => {
  try {
    const { semester, subject, branch, search, sort } = req.query;

    const filter = { uploadedBy: req.user.id };
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (branch) filter.branch = branch;
    if (search) filter.title = { $regex: search, $options: "i" };

    let sortOptions = {};
    if (sort === "date") sortOptions = { createdAt: 1 };
    else if (sort === "name") sortOptions = { title: 1 };
    else sortOptions = { createdAt: -1 };

    const notes = await noteModel.find(filter).sort(sortOptions);

    res.status(200).json({
      message: "Your notes retrieved successfully.",
      notes,
      count: notes.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve your notes.", error: error.message });
  }
};

// Get a single note by ID
export const getNoteByIdController = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found." });
    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve note.", error: error.message });
  }
};

// Download a note
export const downloadNoteController = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found." });

    if (!note.isPublic && note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: "You do not have permission to download this note." 
      });
    }

    note.downloads += 1;
    await note.save();

    // Proxy the file from Cloudinary to avoid CORS issues with frontend axios calls
    https.get(note.fileUrl, (cloudinaryRes) => {
      res.setHeader('Content-Type', cloudinaryRes.headers['content-type'] || 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${note.fileName || 'note.pdf'}"`);
      
      cloudinaryRes.pipe(res);
    }).on('error', (err) => {
      console.error("Cloudinary download stream error:", err);
      res.status(500).json({ message: "Failed to stream file from storage." });
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to download note.", error: error.message });
  }
};

// Delete a note
export const deleteNoteController = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found." });

    if (note.uploadedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only delete your own notes." });
    }

    // Delete from Cloudinary — must use resource_type: 'raw' to match how it was uploaded
    try {
      const uploadIndex = note.fileUrl.indexOf('/upload/');
      if (uploadIndex !== -1) {
        let publicIdPath = note.fileUrl.substring(uploadIndex + 8);
        publicIdPath = publicIdPath.replace(/^v\d+\//, ''); // strip version prefix like v1234567890/
        await cloudinary.uploader.destroy(publicIdPath, { resource_type: 'raw' })
          .catch((err) => console.error("Cloudinary delete failed:", err));
      }
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
    }

    await noteModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note.", error: error.message });
  }
};

// Update note visibility
export const updateNoteVisibilityController = async (req, res) => {
  try {
    const { isPublic } = req.body;
    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found." });

    if (note.uploadedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only modify your own notes." });
    }

    note.isPublic = isPublic;
    await note.save();
    res.status(200).json({ message: "Note visibility updated successfully.", note });
  } catch (error) {
    res.status(500).json({ message: "Failed to update note visibility.", error: error.message });
  }
};

// Rate a note
export const rateNoteController = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const note = await noteModel.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found." });

    const totalRating = note.rating * note.ratingCount + rating;
    note.ratingCount += 1;
    // Ensure rating is saved as a number
    note.rating = Number((totalRating / note.ratingCount).toFixed(1));
    await note.save();

    res.status(200).json({ message: "Note rated successfully.", note });
  } catch (error) {
    res.status(500).json({ message: "Failed to rate note.", error: error.message });
  }
};