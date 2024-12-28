import express from "express"
const router = express.Router()
import {protectRoute} from "../middleware/protectedRoute.js"
import { getMessage, sendMessage } from "../controllers/message.controller.js"

router.post("/send/:id",protectRoute, sendMessage)
router.get("/all/:id",protectRoute,getMessage)


export default router