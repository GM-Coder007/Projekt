import { Router } from "express";
import driveController from "../controllers/driveController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/drives", driveController.driveGet);
router.post(
  "/drives",
  apiMiddleware,
  denyMiddleware,
  driveController.drivePost
);
router.put(
  "/drives/:id",
  apiMiddleware,
  denyMiddleware,
  driveController.drivePut
);
router.delete(
  "/drives",
  apiMiddleware,
  denyMiddleware,
  driveController.driveDelete
);

export default router;
