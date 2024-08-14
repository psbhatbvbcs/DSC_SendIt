/** Required External Modules */
import express from "express";
import {
  getAllPostsForAdminController,
  getPostWithIdController,
  getRandomFiveController,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/getPostWithId/:uniqueId", getPostWithIdController);
router.get("/getAllPostsForAdmin", getAllPostsForAdminController);
router.get("/getRandomFive", getRandomFiveController);

export default router;
