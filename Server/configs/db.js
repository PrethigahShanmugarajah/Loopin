// Server/configs/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/loopin`);
  } catch (error) {
    console.log("Database Connected Error:", error.message);
  }
};

export default connectDB;
