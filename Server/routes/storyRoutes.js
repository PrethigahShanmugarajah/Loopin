// Server / routes / storyRoutes.js
import express from "express";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";
import { addUserStory } from "../controllers/storyController.js";

const storyRouter = express.Router();

storyRouter.post("/create", upload.single("media"), protect, addUserStory);

export default storyRouter;
