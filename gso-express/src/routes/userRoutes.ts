import { Router } from "express";
import userController from "../controllers/userController";
import { body, query } from "express-validator";
import authMiddleware from "../middlewares/authMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/profile", authMiddleware, denyMiddleware, userController.profile);
router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().not().isEmpty(),
  query("type").default("session").isIn(["session", "jwt"]),
  userController.login
);
router.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().not().isEmpty(),
  userController.register
);
router.put(
  "/profile",
  authMiddleware,
  denyMiddleware,
  body("twofa").isBoolean().not().isEmpty(),
  userController.edit
);

export default router;
