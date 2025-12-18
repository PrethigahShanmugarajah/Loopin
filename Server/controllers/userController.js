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

/* -------- Find Users using username, email, location, name -------- */
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    const filteredUsers = allUsers.filter((user) => user._id !== userId);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      users: filteredUsers,
    });
  } catch (error) {
    console.error("Find Users Error:", error);

    return res.status(500).json({
      success: false,
      message: `Find Users Error: ${error.code || error.message}`,
    });
  }
};

/* -------- Follow User -------- */
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      return res.status(200).json({
        success: true,
        message: "You are already following this user",
      });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    res.status(200).json({
      success: true,
      message: "Now you are following this user",
      followedUser: {
        username: toUser.username,
      },
    });
  } catch (error) {
    console.error("Follow User Error:", error);

    return res.status(500).json({
      success: false,
      message: `Follow User Error: ${error.code || error.message}`,
    });
  }
};
