import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadNote,
  getNotes,
  downloadNote,
  rateNote,
  deleteNote
} from "../controllers/notesController.js";
import { protect } from "../middleware/auth.js";

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpeg|jpg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error("Only PDF and images allowed"));
  }
});

const router = express.Router();

router.get("/", protect, getNotes);
router.post("/", protect, upload.single("file"), uploadNote);
router.put("/:id/download", protect, downloadNote);
router.put("/:id/rate", protect, rateNote);
router.delete("/:id", protect, deleteNote);

export default router;