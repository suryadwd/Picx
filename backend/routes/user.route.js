import express from "express"
import { editProfile, follow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controoler.js"
import {protectRoute} from "../middleware/protectedRoute.js"
import upload from "../middleware/multer.js"
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.get("/logout",logout)
router.get("/profile/:id",protectRoute,getProfile)
router.post("/profile/edit",protectRoute,upload.single('profilePicture'),editProfile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/followUnfollow/:id",protectRoute,follow)


export default router