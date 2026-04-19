import { Router } from "express";
import { getActivities } from "../controllers/activityController.js";

const router = Router();

router.get("/", getActivities);

export default router;
