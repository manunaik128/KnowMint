import express from "express";
import multer from "multer";
import {
  uploadNoteController,
  getAllPublicNotesController,
  getUserNotesController,
  getNoteByIdController,
  downloadNoteController,
  deleteNoteController,
  updateNoteVisibilityController,
  rateNoteController,
} from "../controller/note.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/explore", getAllPublicNotesController);
router.get("/download/:id", downloadNoteController);

// Protected routes (authentication required)
router.post(
  "/upload",
  authenticateUser,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ 
              message: "File size is too large. Maximum size is 20MB." 
            });
          }
          return res.status(400).json({ 
            message: "File upload error: " + err.message 
          });
        }
        return res.status(400).json({ 
          message: err.message 
        });
      }
      next();
    });
  },
  uploadNoteController
);
router.get("/my-notes", authenticateUser, getUserNotesController);
router.delete("/:id", authenticateUser, deleteNoteController);
router.patch("/:id/visibility", authenticateUser, updateNoteVisibilityController);
router.post("/:id/rate", authenticateUser, rateNoteController);

// Place :id route last so it doesn't intercept other routes
router.get("/:id", getNoteByIdController);

export default router;
