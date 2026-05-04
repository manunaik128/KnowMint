import express from "express";
import {
  getNoteSummaryController,
  askNoteQuestionController,
} from "../controller/ai.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes (authentication required)
router.get("/summary/:noteId", authenticateUser, getNoteSummaryController);
router.post("/question/:noteId", authenticateUser, askNoteQuestionController);

export default router;
