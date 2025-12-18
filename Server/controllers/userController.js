// Server / controllers / userController.js
import User from "../models/User.js";

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
    res
      .status(200)
      .json({
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
