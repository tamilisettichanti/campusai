import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["lost", "found"], required: true },
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resolved: { type: Boolean, default: false },
  aiMatchId: { type: mongoose.Schema.Types.ObjectId, ref: "LostItem", default: null },
}, { timestamps: true });

export default mongoose.model("LostItem", lostItemSchema);