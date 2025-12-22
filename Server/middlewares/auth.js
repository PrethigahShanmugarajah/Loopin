export const protect = async (req, res, next) => {
  try {
    const { userId } = await req.auth();

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authenticated" });
    }

    next();
  } catch (error) {
    console.error("Protect middleware Error:", error);

    return res.status(500).json({
      success: false,
      message: `Protect middleware Error: ${
        error.code || error.message || "Internal Server Error"
      }`,
    });
  }
};
