import { Router } from "express";
import roadWorksController from "../controllers/roadWorksController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/", roadWorksController.roadworksGet);
router.post(
  "/",
  apiMiddleware,
  denyMiddleware,
  roadWorksController.roadworksPost
);

export default router;
