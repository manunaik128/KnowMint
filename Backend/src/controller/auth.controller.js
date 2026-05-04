import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

export const userRegisterController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token, // Return token for localStorage fallback
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register user.",
      error: error.message,
    });
  }
};

export const userLoginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(200).json({
      message: "User logged in successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token, // Return token for localStorage fallback
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to login user.",
      error: error.message,
    });
  }
};

export const userLogoutController = async (req, res) => {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
  res.status(200).json({
    message: "User logged out successfully.",
  });
};

export const userProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load profile.",
      error: error.message,
    });
  }
};