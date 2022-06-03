import { Router } from "express";
import userController from "../controllers/userController";
import { body } from "express-validator";

const router = Router();

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().not().isEmpty(),
  userController.login
);
router.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().not().isEmpty(),
  userController.register
);

export default router;
