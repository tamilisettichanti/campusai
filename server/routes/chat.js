import express from "express";
import { chat, getQuickQuestions } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, chat);
router.get("/questions", protect, getQuickQuestions);

export default router;