import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileSize: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    uploaderName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const noteModel = mongoose.model("note", noteSchema);

export default noteModel;
