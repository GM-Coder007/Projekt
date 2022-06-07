import { Router } from "express";
import { param } from "express-validator";
import roadQualityController from "../controllers/roadQualityController";
import apiMiddleware from "../middlewares/apiMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/", roadQualityController.roadqualityGet);
router.get(
  "/:driveId",
  authMiddleware,
  denyMiddleware,
  param("driveId").isMongoId(),
  roadQualityController.roadqualityGetById
);
router.post(
  "/",
  apiMiddleware,
  denyMiddleware,
  roadQualityController.roadqualityPost
);

export default router;
