import { Router } from "express";
import { param } from "express-validator";
import driveController from "../controllers/driveController";
import apiMiddleware from "../middlewares/apiMiddleware";
import authMiddleware from "../middlewares/authMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get(
  "/recalculate",
  apiMiddleware,
  denyMiddleware,
  driveController.driveRecalculate
);
router.get("/", authMiddleware, denyMiddleware, driveController.driveGet);
router.post("/", authMiddleware, denyMiddleware, driveController.drivePost);
router.put(
  "/:id",
  param("id").isMongoId(),
  authMiddleware,
  denyMiddleware,
  driveController.drivePut
);
router.delete(
  "/:id",
  param("id").isMongoId(),
  authMiddleware,
  denyMiddleware,
  driveController.driveDelete
);

export default router;
