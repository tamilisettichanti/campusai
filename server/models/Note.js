import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  unit: { type: String, default: "" },
  description: { type: String, default: "" },
  fileUrl: { type: String, required: true },
  aiTags: [{ type: String }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  branch: { type: String, default: "" },
  year: { type: Number, default: 1 },
  downloads: { type: Number, default: 0 },
  ratings: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 }
  }],
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);