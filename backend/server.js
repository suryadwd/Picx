import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { dbConnect } from "./config/db.js";
import cloudinary from "./config/cloudDb.js";
import userRoute from "../backend/routes/user.route.js";
import { app, server } from "./socket/socket.js";

//socket js se layege ab
// const app = express()

dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://picx-kzg6.onrender.com",
    "https://picx-git-main-suryakant-dwivedis-projects.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["set-cookie"],
  preflightContinue: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.set("trust proxy", 1); // trust first proxy

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

//ab app.listen ki jagah server.listen hoga

server.listen(process.env.PORT, () => {
  console.log(`server running ${process.env.PORT}`);
  dbConnect();
  cloudinary;
});
