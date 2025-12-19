// Server / controllers / storyController.js
import fs from "fs";
import imagekit from "../configs/imageKit";
import Story from "../models/Story";

/* -------- Add User Story -------- */
export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";

    // Upload media to imagekit
    if (media_type == "image" || media_type == "video") {
      const fileBuffer = fs.readFileSync(media.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      });
      media_url = response.url;
    }

    // Create story
    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    res
      .status(201)
      .json({ success: true, message: "Story added successfully!", story });
  } catch (error) {
    console.error("Add User Story Error:", error);

    return res.status(500).json({
      success: false,
      message: `Add User Story Error: ${error.code || error.message}`,
    });
  }
};
