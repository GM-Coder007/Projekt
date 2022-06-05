import { Router } from "express";
import roadWorksController from "../controllers/roadWorksController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/roadworks", roadWorksController.roadworksGet);
router.post(
  "/roadworks",
  apiMiddleware,
  denyMiddleware,
  roadWorksController.roadworksPost
);

export default router;
