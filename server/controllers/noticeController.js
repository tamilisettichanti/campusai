import Notice from "../models/Notice.js";
import Groq from "groq-sdk";

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateSummary = async (content) => {
  try {
    const groq = getGroq();
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Summarize this college notice in 2 short lines only:\n\n${content}`
      }]
    });
    return res.choices[0].message.content;
  } catch (error) {
    return "";
  }
};

// Create Notice (admin/faculty only)
export const createNotice = async (req, res) => {
  try {
    const { title, content, targetBranch, targetYear, important } = req.body;

    const aiSummary = await generateSummary(content);

    const notice = await Notice.create({
      title,
      content,
      aiSummary,
      postedBy: req.user._id,
      targetBranch: targetBranch || "ALL",
      targetYear: targetYear || "ALL",
      important: important || false,
    });

    const populated = await notice.populate("postedBy", "name role");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Notices (filtered by branch/year)
export const getNotices = async (req, res) => {
  try {
    const { branch, year } = req.query;

    const query = {
      $or: [
        { targetBranch: "ALL" },
        { targetBranch: branch || "ALL" },
      ]
    };

    const notices = await Notice.find(query)
      .populate("postedBy", "name role")
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Notice
export const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate("postedBy", "name role");

    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Notice
export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};