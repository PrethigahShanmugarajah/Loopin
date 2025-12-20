// Server / routes / messageRoutes.js
import express from "express";
import { sseController } from "../controllers/messageController.js";

const messageRouter = express.Router();
messageRouter.get("/:userId", sseController);

export default messageRouter;
