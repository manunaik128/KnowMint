import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token." });
    }

    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token.", error: error.message });
  }
};
