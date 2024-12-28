import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
dotenv.config();

export const protectRoute = async (req, res, next) => {
  
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ Message: "token not found" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) return res.status(401).json({ Message: "payload not found" });

    const user = await userModel.findById(payload._id);

    if (!user) return res.status(401).json({ Message: "payload not found" });

    req.user = user;

    next();

  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
