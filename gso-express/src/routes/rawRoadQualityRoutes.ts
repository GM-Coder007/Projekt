import { Router } from "express";
import rawRoadQualityController from "../controllers/rawRoadQualityController";
import authorizeAPI from "../middlewares/authorizeAPI";
import authorizeJWT from "../middlewares/jwtMiddleware";
import authorizeSession from "../middlewares/sessionMiddleware";

const router = Router();

router.get(
  "/rawroadquality",
  authorizeJWT,
  authorizeSession,
  authorizeAPI,
  rawRoadQualityController.rawroadqualityGet
);
router.post(
  "/rawroadquality",
  authorizeJWT,
  authorizeSession,
  rawRoadQualityController.rawroadqualityPost
);

export default router;
