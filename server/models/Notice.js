import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  aiSummary: { type: String, default: "" },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetBranch: { type: String, default: "ALL" },
  targetYear: { type: String, default: "ALL" },
  important: { type: Boolean, default: false },
  attachments: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("Notice", noticeSchema);