import { Request, Response, Router } from "express";
import dataController from "../controllers/dataController";

const router = Router();

router.get("/roadquality", dataController.roadworksGet);
router.post("/roadquality", dataController.roadworksPost);

router.get("/roadworks", dataController.roadworksGet);
router.post("/roadworks", dataController.roadworksPost);

export default router;
