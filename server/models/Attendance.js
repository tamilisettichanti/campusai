import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  records: [{
    date: { type: Date },
    status: { type: String, enum: ["present", "absent"] }
  }],
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
