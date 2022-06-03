import { Router } from "express";
import roadWorksController from "../controllers/roadWorksController";
import authorizeAPI from "../middlewares/authorizeAPI";

const router = Router();

router.get("/roadworks", roadWorksController.roadworksGet);
router.post("/roadworks", authorizeAPI, roadWorksController.roadworksPost);

export default router;
