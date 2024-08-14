/** Required External Modules */
import express from "express";
import multer from "multer";
import ImageKit from "imagekit";
import * as dotenv from "dotenv";

import {
  cdnImageUploadController,
  uploadWithoutFileController,
} from "../controllers/cdnController.js";

dotenv.config();

const router = express.Router();

const _storage = multer.memoryStorage();
const upload = multer({ storage: _storage });

export const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

router.post("/upload", upload.single("cdnFile"), cdnImageUploadController);
router.post("/uploadWithoutFile", uploadWithoutFileController);

export default router;
