import { Request, Response, Router } from "express";
import dataController from "../controllers/dataController";

const router = Router();

router.get("/roadquality", dataController.roadqualityGet);
router.post("/roadquality", dataController.roadqualityPost);

router.get("/rawroadquality", dataController.rawroadqualityGet);
router.post("/rawroadquality", dataController.rawroadqualityPost);

router.get("/roadworks", dataController.roadworksGet);
router.post("/roadworks", dataController.roadworksPost);

export default router;
