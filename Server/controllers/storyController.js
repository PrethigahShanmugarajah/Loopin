import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { inngest } from "../inngest/index.js";

/* -------- Add User Story -------- */
export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    // let media_url = "";
    let media_urls = [];

    // Upload media to imagekit
    if (media_type === "image" || media_type === "video") {
      const fileBuffer = fs.readFileSync(media.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: media.originalname,
      });
      // media_url = response.url;
      media_urls.push(response.url);
    }

    // Create story
    const story = await Story.create({
      user: userId,
      content,
      // media_url,
      media_type,
      background_color,
      media_urls,
    });

    // Schedule story deletion after 24 hours
    await inngest.send({
      name: "app/story.delete",
      data: { storyId: story._id },
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

/* -------- Get User Stories -------- */
export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    // User connections and followings
    // const userIds = [userId, ...user.connections, ...user.following];
    const userIds = [
      userId,
      ...(user.connections || []),
      ...(user.following || []),
    ];

    const stories = await Story.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User stories fetched successfully!",
      stories,
    });
  } catch (error) {
    console.error("Get User Stories Error:", error);

    return res.status(500).json({
      success: false,
      message: `Get User Stories Error: ${error.code || error.message}`,
    });
  }
};
