import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  day: { type: String, required: true },
  date: { type: String, required: true },
  breakfast: [{ name: String, price: Number }],
  lunch: [{ name: String, price: Number }],
  snacks: [{ name: String, price: Number }],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("MenuItem", menuItemSchema);