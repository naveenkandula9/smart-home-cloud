import { Router } from "express";
import { getDevices, runScene, updateDevice } from "../controllers/deviceController.js";

const router = Router();

router.get("/", getDevices);
router.post("/scenes/:sceneName", runScene);
router.put("/:deviceName", updateDevice);

export default router;
