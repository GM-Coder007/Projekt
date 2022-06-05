import { Router } from "express";
import driveController from "../controllers/driveController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/", driveController.driveGet);
router.post("/", apiMiddleware, denyMiddleware, driveController.drivePost);
router.put("/:id", apiMiddleware, denyMiddleware, driveController.drivePut);
router.delete("/", apiMiddleware, denyMiddleware, driveController.driveDelete);

export default router;
