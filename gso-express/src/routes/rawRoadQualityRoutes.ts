import { Router } from "express";
import rawRoadQualityController from "../controllers/rawRoadQualityController";

const router = Router();

router.get("/rawroadquality", rawRoadQualityController.rawroadqualityGet);
router.post("/rawroadquality", rawRoadQualityController.rawroadqualityPost);

export default router;
