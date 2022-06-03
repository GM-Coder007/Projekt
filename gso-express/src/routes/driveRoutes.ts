import { Router } from "express";
import driveController from "../controllers/driveController";
import authorizeAPI from "../middlewares/authorizeAPI";

const router = Router();

router.get("/drives", driveController.driveGet);
router.post("/drives", authorizeAPI, driveController.drivePost);

export default router;
