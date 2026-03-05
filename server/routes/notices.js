import express from "express";
import {
  createNotice,
  getNotices,
  getNotice,
  deleteNotice
} from "../controllers/noticeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getNotices);
router.get("/:id", protect, getNotice);
router.post("/", protect, createNotice);
router.delete("/:id", protect, deleteNotice);

export default router;