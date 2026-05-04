import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";
import aiRouter from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/ai", aiRouter);

export default app;
