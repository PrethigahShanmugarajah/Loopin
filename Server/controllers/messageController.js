// Server / controllers / messageController.js
import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";

/* -------- Create an empty to store SS Event connections -------- */
const connections = {};

/* -------- SSE Endpoint -------- */
export const sseController = async (req, res) => {
  const { userId } = req.params;
  console.log("New client connected:", userId);

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Controll-Allow-Origin", "*");

  // Add the client's response object to the connections object
  connections[userId] = res;

  // Send an initial event to the client
  res.write("log: Connected to SSE stream\n\n");

  // Handle client disconnection
  req.on("close", () => {
    // Remove the client's response object from the connections array
    delete connections[userId];
    console.log("Client disconnected");
  });
};

/* -------- Send Message -------- */
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;

    let media_url = "";
    let message_type = image ? "image" : "text";

    if (message_type === "image") {
      const fileBuffer = fs.readFileSync(image.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });

      media_url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    const message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: message,
    });

    // Send message to to_user_id using SSE
    const messageWithUserData = await Message.findById(message.id).populate(
      "from_user_id"
    );

    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`
      );
    }
  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: `Send Message Error: ${error.code || error.message}`,
    });
  }
};

/* -------- Get Chat Messages -------- */
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    }).sort({ created_at: -1 });

    // Mark messages as seen
    await Message.updateMany(
      { from_user_id: to_user_id, to_user_id: userId },
      { seen: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Chat messages fetched successfully!",
        data: messages,
      });
  } catch (error) {
    console.error("Get Chat Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: `Get Chat Messages Error: ${error.code || error.message}`,
    });
  }
};
