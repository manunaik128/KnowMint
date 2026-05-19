import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  console.log("Auth middleware called:", {
    cookies: Object.keys(req.cookies),
    headers: req.headers.authorization,
    method: req.method,
    url: req.url,
  });

  // Check for our custom token OR Clerk session cookie OR Authorization header
  const token = 
    req.cookies.token || 
    req.cookies.__session || 
    req.cookies.__session_FGfzaAR4 ||
    req.headers.authorization?.split(" ")[1];

  console.log("Token found:", !!token);

  if (!token) {
    console.log("No token found in request");
    return res.status(401).json({ message: "Authentication required. Please login first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token." });
    }

    req.user = { id: user._id, email: user.email, name: user.name };
    console.log("User authenticated:", req.user);
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    res.status(401).json({ message: "Invalid or expired token.", error: error.message });
  }
};
