// Server / controllers / postController.js
import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";

/* -------- Add Post -------- */
export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files;

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const response = await imagekit.upload({
            file: fileBuffer,
            fileName: image.originalname,
            folder: "posts",
          });

          const url = imagekit.url({
            path: response.filePath,
            transformation: [
              { quality: "auto" },
              { format: "webp" },
              { width: "1280" },
            ],
          });
          return url;
        })
      );
    }

    const post = await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });

    res
      .status(201)
      .json({ success: true, message: "Post created successfully!", post });
  } catch (error) {
    console.error("Add Post Error:", error);

    return res.status(500).json({
      success: false,
      message: `Add Post Error: ${error.code || error.message}`,
    });
  }
};
