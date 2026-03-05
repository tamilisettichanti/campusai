import Note from "../models/Note.js";
import Groq from "groq-sdk";
import fs from "fs";

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Tag Generator
const generateTags = async (title, subject, description) => {
  try {
    const groq = getGroq();
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Generate 5 short tags for college notes with:
Title: ${title}
Subject: ${subject}
Description: ${description}
Return ONLY a JSON array of 5 strings. Example: ["tag1","tag2","tag3","tag4","tag5"]`
      }]
    });
    const text = res.choices[0].message.content;
    const parsed = JSON.parse(text.match(/\[.*\]/s)[0]);
    return parsed;
  } catch (error) {
    return [subject];
  }
};

// Upload Note
export const uploadNote = async (req, res) => {
  try {
    const { title, subject, unit, description, branch, year } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const aiTags = await generateTags(title, subject, description);

    const note = await Note.create({
      title,
      subject,
      unit,
      description,
      fileUrl,
      aiTags,
      uploadedBy: req.user._id,
      branch: branch || req.user.branch,
      year: year || req.user.year,
    });

    const populated = await note.populate("uploadedBy", "name branch year");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Notes
export const getNotes = async (req, res) => {
  try {
    const { subject, branch, year, search } = req.query;
    let query = {};

    if (subject) query.subject = { $regex: subject, $options: "i" };
    if (branch) query.branch = branch;
    if (year) query.year = year;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { aiTags: { $in: [new RegExp(search, "i")] } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query)
      .populate("uploadedBy", "name branch year")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download Note (increment counter)
export const downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.downloads += 1;
    await note.save();

    res.json({ fileUrl: note.fileUrl, downloads: note.downloads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate a Note
export const rateNote = async (req, res) => {
  try {
    const { rating } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const alreadyRated = note.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyRated) {
      alreadyRated.rating = rating;
    } else {
      note.ratings.push({ user: req.user._id, rating });
    }

    await note.save();
    res.json({ message: "Rating saved", ratings: note.ratings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Delete file from uploads folder
    const filePath = `uploads/${note.fileUrl.split("/uploads/")[1]}`;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};