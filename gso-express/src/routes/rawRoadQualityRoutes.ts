import { Router } from "express";
import rawRoadQualityController from "../controllers/rawRoadQualityController";
import apiMiddleware from "../middlewares/apiMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  apiMiddleware,
  denyMiddleware,
  rawRoadQualityController.rawroadqualityGet
);
router.post(
  "/",
  authMiddleware,
  denyMiddleware,
  rawRoadQualityController.rawroadqualityPost
);

export default router;
