/** Required External Modules */
import express from "express";
import {
  loginController,
  signupUserController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginController);
router.post("/signup", signupUserController);

export default router;
