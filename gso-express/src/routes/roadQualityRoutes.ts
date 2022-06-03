import { Router } from "express";
import roadQualityController from "../controllers/roadQualityController";
import authorizeAPI from "../middlewares/authorizeAPI";

const router = Router();

router.get("/roadquality", roadQualityController.roadqualityGet);
router.get("/roadquality/:driveId", roadQualityController.roadqualityGet);
router.post(
  "/roadquality",
  authorizeAPI,
  roadQualityController.roadqualityPost
);

export default router;
