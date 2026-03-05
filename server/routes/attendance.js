import express from "express";
import {
  upsertAttendance,
  getMyAttendance,
  logClass
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getMyAttendance);
router.post("/", protect, upsertAttendance);
router.post("/log", protect, logClass);

export default router;