import express from "express";
import {
  getTodayMenu,
  getAllMenus,
  upsertMenu
} from "../controllers/canteenController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/today", protect, getTodayMenu);
router.get("/", protect, getAllMenus);
router.post("/", protect, upsertMenu);

export default router;