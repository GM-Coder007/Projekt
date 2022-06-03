import { Router } from "express";
import roadQualityController from "../controllers/roadQualityController";

const router = Router();

router.get("/roadquality", roadQualityController.roadqualityGet);
router.post("/roadquality", roadQualityController.roadqualityPost);

export default router;
