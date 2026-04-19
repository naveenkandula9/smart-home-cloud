import { Router } from "express";
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
} from "../controllers/scheduleController.js";

const router = Router();

router.get("/", getSchedules);
router.post("/", createSchedule);
router.patch("/:scheduleId", updateSchedule);
router.delete("/:scheduleId", deleteSchedule);

export default router;
