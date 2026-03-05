import Attendance from "../models/Attendance.js";
import Groq from "groq-sdk";

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Warning Generator
const generateWarning = async (subject, percentage) => {
  try {
    const groq = getGroq();
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `A student has ${percentage}% attendance in ${subject}.
Write a short 1 line friendly warning or motivation message.
If above 75% give encouragement. If below 75% give urgent warning.
Reply with ONLY the message, nothing else.`
      }]
    });
    return res.choices[0].message.content;
  } catch (error) {
    return "";
  }
};

// Add or Update Subject Attendance
export const upsertAttendance = async (req, res) => {
  try {
    const { subject, totalClasses, attendedClasses } = req.body;

    const percentage = Math.round((attendedClasses / totalClasses) * 100);

    const attendance = await Attendance.findOneAndUpdate(
      { student: req.user._id, subject },
      {
        student: req.user._id,
        subject,
        totalClasses,
        attendedClasses,
        percentage,
      },
      { upsert: true, new: true }
    );

    const aiWarning = await generateWarning(subject, percentage);

    res.json({
      ...attendance.toObject(),
      aiWarning,
      status: percentage >= 75 ? "✅ Safe" : "⚠️ Low Attendance!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Attendance
export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user._id })
      .sort({ subject: 1 });

    const summary = records.map(r => ({
      subject: r.subject,
      percentage: r.percentage,
      totalClasses: r.totalClasses,
      attendedClasses: r.attendedClasses,
      status: r.percentage >= 75 ? "✅ Safe" : "⚠️ Danger!",
      classesNeeded: r.percentage < 75
        ? Math.ceil((0.75 * r.totalClasses - r.attendedClasses) / 0.25)
        : 0
    }));

    res.json({
      records: summary,
      overallPercentage: summary.length > 0
        ? Math.round(summary.reduce((a, b) => a + b.percentage, 0) / summary.length)
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log Single Class (present/absent)
export const logClass = async (req, res) => {
  try {
    const { subject, status, date } = req.body;

    let attendance = await Attendance.findOne({
      student: req.user._id,
      subject
    });

    if (!attendance) {
      attendance = await Attendance.create({
        student: req.user._id,
        subject,
        totalClasses: 0,
        attendedClasses: 0,
        percentage: 0,
      });
    }

    attendance.records.push({ date: date || new Date(), status });
    attendance.totalClasses += 1;
    if (status === "present") attendance.attendedClasses += 1;
    attendance.percentage = Math.round(
      (attendance.attendedClasses / attendance.totalClasses) * 100
    );

    await attendance.save();

    res.json({
      subject,
      percentage: attendance.percentage,
      status: attendance.percentage >= 75 ? "✅ Safe" : "⚠️ Danger!",
      classesNeeded: attendance.percentage < 75
        ? Math.ceil((0.75 * attendance.totalClasses - attendance.attendedClasses) / 0.25)
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};