import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import bodyParser from "body-parser";
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import { dbConnect } from "./config/db.js"
import cloudinary from "./config/cloudDb.js"
import userRoute from "../backend/routes/user.route.js"
const app = express()
dotenv.config()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
  origin:"http://localhost:5173",
  credentials:true
}
app.use(cors(corsOptions))

app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)


app.listen(process.env.PORT, () => {
  console.log(`server running ${process.env.PORT}`)
  dbConnect()
  cloudinary
})
