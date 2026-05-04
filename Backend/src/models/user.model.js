import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required to register new user"],
      minLength: [6, "Password should contain more than 6 character"],
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema)

export default userModel