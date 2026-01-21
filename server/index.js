import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import { SYSTEM_PROMPT, buildInitialUserMessage } from "./prompts.js";

dotenv.config();

dotenv.config();

const PORT = process.env.PORT || 8787;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(express.json({ limit: "1mb" }));

// --- CORS (demo-friendly, robust) ---
// Allow and reflect origin for demo; handle OPTIONS preflight reliably.
app.use(
  cors({
    origin: true,                // reflect request origin
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Explicitly respond to all preflight OPTIONS requests with CORS headers
app.options("*", cors({ origin: true }));
// --- end CORS ---



// Ensure uploads dir exists (temp storage)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer: 5MB limit, PNG/JPG/JPEG only
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype);
    cb(ok ? null : new Error("Only PNG/JPG/JPEG allowed"), ok);
  }
});

/**
 * NOTE:
 * You must set OPENAI_API_KEY in server/.env for chat to work.
 */
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * POST /api/upload
 * multipart/form-data with field: screenshot
 * returns: { fileId, originalName, mimeType, size }
 */
app.post("/api/upload", upload.single("screenshot"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    return res.json({
      fileId: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Upload failed" });
  }
});

/**
 * POST /api/chat
 * body:
 * {
 *   sessionId: string,
 *   summaryText: string,
 *   messages: [{ role: "user"|"assistant", content: string }]
 * }
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { sessionId, summaryText, messages } = req.body || {};

    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });
    if (!summaryText) return res.status(400).json({ error: "Missing summaryText" });
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages must be an array" });

    const promptMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildInitialUserMessage(summaryText) },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: promptMessages,
      temperature: 0.2
    });

    const assistantText = completion.choices?.[0]?.message?.content?.trim() || "";

    return res.json({ assistant: assistantText });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "AI request failed",
      detail: err?.message || String(err)
    });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS origin: ${CLIENT_ORIGIN}`);
});
