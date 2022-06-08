import { Router } from "express";
import { body } from "express-validator";
import roadWorksController from "../controllers/roadWorksController";
import apiMiddleware from "../middlewares/apiMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/", roadWorksController.roadworksGet);
router.post(
  "/",
  body("title").isString().isLength({ min: 1 }),
  body("summary").isString(),
  apiMiddleware,
  denyMiddleware,
  roadWorksController.roadworksPost
);

export default router;
