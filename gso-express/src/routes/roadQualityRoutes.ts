import { Router } from "express";
import roadQualityController from "../controllers/roadQualityController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/roadquality", roadQualityController.roadqualityGet);
router.get("/roadquality/:driveId", roadQualityController.roadqualityGet);
router.post(
  "/roadquality",
  apiMiddleware,
  denyMiddleware,
  roadQualityController.roadqualityPost
);

export default router;
