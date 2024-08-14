// authMiddleware.js

import jwt from "jsonwebtoken";
import ErrorHandler from "./errorHandler.js";
import { userModel } from "../models/userData.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Get the JWT token from the request headers or cookies
    const token = req.headers.authorization || req.cookies.token;

    if (!token) {
      return next(new ErrorHandler("Unauthorized access", 401));
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the admin from the database based on the decoded token
    req.user = await userModel.findById(decoded._id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};
