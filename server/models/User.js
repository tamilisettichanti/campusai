import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["student", "faculty", "admin", "canteen", "bus_coordinator"],
    default: "student" 
  },
  branch: { type: String, default: "" },
  year: { type: Number, default: 1 },
  rollNumber: { type: String, default: "" },
  avatar: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);