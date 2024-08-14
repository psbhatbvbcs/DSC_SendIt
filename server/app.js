// Required External modules
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// Required App modules

import cdnRouter from "./routes/cdnRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import actionsRouter from "./routes/actionsRouter.js";

dotenv.config();

export const PORT = parseInt(process.env.PORT ?? "8080");

export const app = express();

/** App Configuration */
app.use(express.json({ limit: "500mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "500mb", extended: true })); // Adjust the limit as needed
app.use(cookieParser());

// allowing access to frontend domain\
// ["https://insights-frontend-v2.vercel.app", "http://localhost:3000"]
app.use(
  cors({
    origin: [
      "https://dsc-admin.vercel.app",
      "https://dsc-frontend-sooty.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/cdn", cdnRouter);
app.use("/api/getPost", userRouter);
app.use("/api/actions", actionsRouter);

app.get("/api/healthcheck", (req, res) => {
  const message = "Hello world";
  return res.status(200).json(message);
});
