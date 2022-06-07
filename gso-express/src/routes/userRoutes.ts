import { Router } from "express";
import userController from "../controllers/userController";
import { body, query } from "express-validator";
import authMiddleware from "../middlewares/authMiddleware";
import denyMiddleware from "../middlewares/denyMiddleware";

const router = Router();

router.get("/profile", authMiddleware, denyMiddleware, userController.profile);
router.get("/logout", authMiddleware, denyMiddleware, userController.logout);
router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().not().isEmpty(),
  query("setCookie").default(false).isBoolean(),
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
