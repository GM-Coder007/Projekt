import { Router } from "express";
import settingsController from "../controllers/settingsController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/", settingsController.settingsGet);
router.post(
  "/",
  apiMiddleware,
  denyMiddleware,
  settingsController.settingsPost
);

export default router;
