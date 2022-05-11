import { Request, Response, Router } from "express";
import dataController from "../controllers/dataController";

const router = Router();

router.get("/roadworks", dataController.roadworksGet);
router.post("/roadworks", dataController.roadworksPost);

export default router;
