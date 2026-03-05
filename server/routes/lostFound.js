import express from "express";
import {
  postItem,
  getItems,
  resolveItem
} from "../controllers/lostFoundController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getItems);
router.post("/", protect, postItem);
router.put("/:id/resolve", protect, resolveItem);

export default router;