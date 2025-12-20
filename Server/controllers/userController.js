// Server / controllers / userController.js
import imagekit from "../configs/imageKit.js";
import { inngest } from "../inngest/index.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
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
      message: "Now you are following this user!",
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

/* -------- Unfollow User -------- */
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    user.following = user.following.filter((user) => user !== id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers = toUser.followers.filter((user) => user !== userId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "You have unfollowed this user successfully!",
      unfollowedUser: {
        username: toUser.username,
      },
    });
  } catch (error) {
    console.error("Unfollow User Error:", error);

    return res.status(500).json({
      success: false,
      message: `Unfollow User Error: ${error.code || error.message}`,
    });
  }
};

/* -------- Send Connection Request -------- */
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Check if user has sent more than 20 connection requests in the last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24Hours },
    });

    if (connectionRequests.length >= 20) {
      return res.status(429).json({
        success: false,
        message:
          "You have sent more than 20 connection requests in the last 24 hours",
      });
    }

    // Check if users are already connected
    const connection = await Connection.findOne({
      $or: [
        { rom_user_id: userId, to_user_id: id },
        { rom_user_id: id, to_user_id: userId },
      ],
    });

    if (!connection) {
      const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });

      await inngest.send({
        name: "app/connection-request",
        data: { connectionId: newConnection._id },
      });

      return res.status(201).json({
        success: true,
        message: "Connection request sent successfully!",
      });
    } else if (connection && connection.status === "accepted") {
      return res.status(200).json({
        success: false,
        message: "You are already connected with this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Connection request pending!",
    });
  } catch (error) {
    console.error("Send Connection Request Error:", error);

    return res.status(500).json({
      success: false,
      message: `Send Connection Request Error: ${error.code || error.message}`,
    });
  }
};

/* -------- Get User Connection -------- */
export const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId).populate(
      "connections followers following"
    );

    const connections = user.connections;
    const followers = user.followers;
    const following = user.following;

    const pendingConnections = (
      await Connection.find({ to_user_id: userId, status: "pending" }).populate(
        "from_user_id"
      )
    ).map((connection) => connection.from_user_id);

    res.status(200).json({
      success: true,
      message: "User connections fetched successfully!",
      connections,
      followers,
      following,
      pendingConnections,
    });
  } catch (error) {
    console.error("Get User Connection Error:", error);

    return res.status(500).json({
      success: false,
      message: `Get User Connection Error: ${error.code || error.message}`,
    });
  }
};

/* -------- Accept Connection Request -------- */
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const connection = await Connection.findOne({
      from_user_id: id,
      to_user_id: userId,
    });

    if (!connection) {
      return res
        .status(404)
        .json({ success: false, message: "Connection not fount" });
    }

    const user = await User.findById(userId);
    user.connections.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.connections.push(userId);
    await toUser.save();

    connection.status = "accepted";
    await connection.save();

    res.status(200).json({
      success: true,
      message: "Connection accepted successfully!",
      acceptedUser: {
        username: toUser.username,
      },
    });
  } catch (error) {
    console.error("Get User Connection Error:", error);

    return res.status(500).json({
      success: false,
      message: `Get User Connection Error: ${error.code || error.message}`,
    });
  }
};

/* -------- Get User Profiles -------- */
export const getUserProfiles = async (req, res) => {
  try {
    const { profileId } = req.body;
    const profile = await User.findById(profileId);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    const posts = await Post.find({ user: profileId }).populate("user");

    res.status(200).json({
      success: true,
      message: "Profile and posts fetched successfully!",
      profile,
      posts,
    });
  } catch (error) {
    console.error("Get User Profiles Error:", error);

    return res.status(500).json({
      success: false,
      message: `Get User Profiles Error: ${error.code || error.message}`,
    });
  }
};
