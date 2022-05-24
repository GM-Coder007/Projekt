import { Request, Response, Router } from "express";
import userController from "../controllers/userController";
import { body, validationResult } from "express-validator";

const router = Router();

router.post(
  "/login",
  body("username").not().isEmpty().trim().escape(),
  body("password").not().isEmpty(),
  userController.login
);
router.post("/register", userController.register);

/*router.get("/", userController.list);
router.get("/:id", userController.show);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.remove);*/

export default router;
