// Server / routes / postRoutes.js
import express from "express";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";
import { addPost } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, addPost);

export default postRouter;
