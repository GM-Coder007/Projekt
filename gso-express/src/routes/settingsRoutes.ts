import { Router } from "express";
import settingsController from "../controllers/settingsController";

const router = Router();

router.get("/", settingsController.settingsGet);
router.post("/", settingsController.settingsPost);

export default router;
