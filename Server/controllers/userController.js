// Server / controllers / userController.js
import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";

/* -------- Get User Data Using UserId -------- */
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    res.status(200).json({
      success: true,
      message: "User data fetched successfully!",
      user,
    });
  } catch (error) {
    console.error("Get User Data Using UserId Error:", error);

    return res.status(500).json({
      success: false,
      message: `Get User Data Using UserId Error: ${
        error.code || error.message
      }`,
    });
  }
};

/* -------- Update User Data -------- */
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);

    !username && (username = tempUser.username);

    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        // We will not change the username if it is already taken
        username = tempUser.username;
      }
    }

    const updatedData = { username, bio, location, full_name };

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });
      updatedData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const response = await imagekit.upload({
        file: buffer,
        fileName: cover.originalname,
      });

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res
      .status(200)
      .json({ success: true, message: "Profile Updated Successfully!", user });
  } catch (error) {
    console.error("Update User Data Error:", error);

    return res.status(500).json({
      success: false,
      message: `Update User Data Error: ${error.code || error.message}`,
    });
  }
};
