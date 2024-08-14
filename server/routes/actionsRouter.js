/** Required External Modules */
import express from "express";
import {
  downvoteController,
  upvoteController,
} from "../controllers/actionsController.js";

const router = express.Router();

router.post("/upvote/:uniqueId", upvoteController);
router.post("/downvote/:uniqueId", downvoteController);

export default router;
