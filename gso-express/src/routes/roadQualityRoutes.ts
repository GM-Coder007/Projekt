import { Router } from "express";
import roadQualityController from "../controllers/roadQualityController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/", roadQualityController.roadqualityGet);
router.get("/:driveId", roadQualityController.roadqualityGet);
router.post(
  "/",
  apiMiddleware,
  denyMiddleware,
  roadQualityController.roadqualityPost
);

export default router;
