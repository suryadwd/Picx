import express from "express"
const router = express.Router()
import {protectRoute} from "../middleware/protectedRoute.js"
import { addComment, bookmarkPost, createPost, deletePost, getAllPost, getCommentsFromPost, getUserPost, likeUnlike } from "../controllers/post.controller.js"
import upload from "../middleware/multer.js"

router.post("/addpost",protectRoute, upload.single('image'), createPost)
router.get("/all",protectRoute,getAllPost)
router.get("/userpost/all",protectRoute, getUserPost)
router.get("/like/:id", protectRoute, likeUnlike)
router.post("/comment/:id",protectRoute, addComment)
router.post("/comment/all/:id",protectRoute, getCommentsFromPost)
router.delete("/delete/:id",protectRoute,deletePost)
router.get("/bookmark/:id",protectRoute,bookmarkPost)

export default router