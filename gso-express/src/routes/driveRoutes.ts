import { Router } from "express";
import driveController from "../controllers/driveController";

const router = Router();

router.get("/drives", driveController.driveGet);
router.post("/drives", driveController.drivePost);

export default router;
