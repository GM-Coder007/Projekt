import { Router } from "express";
import rawRoadQualityController from "../controllers/rawRoadQualityController";
import apiMiddleware from "../middlewares/apiMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get(
  "/rawroadquality",
  authMiddleware,
  apiMiddleware,
  denyMiddleware,
  rawRoadQualityController.rawroadqualityGet
);
router.post(
  "/rawroadquality",
  authMiddleware,
  denyMiddleware,
  rawRoadQualityController.rawroadqualityPost
);

export default router;
