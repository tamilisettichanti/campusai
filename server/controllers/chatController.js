import Groq from "groq-sdk";
import Notice from "../models/Notice.js";
import MenuItem from "../models/MenuItem.js";
import LostItem from "../models/LostItem.js";
import Note from "../models/Note.js";
import Attendance from "../models/Attendance.js";

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// Fetch real campus data to give AI context
const getCampusContext = async (userId) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Get today's notices
    const notices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("postedBy", "name");

    // Get today's menu
    const menu = await MenuItem.findOne({ date: today });

    // Get recent lost items
    const lostItems = await LostItem.find({ resolved: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get student attendance
    const attendance = await Attendance.find({ student: userId });

    return `
You are CampusAI, a helpful assistant for college students.
Today's date: ${new Date().toLocaleDateString()}

RECENT NOTICES:
${notices.map(n => `- ${n.title}: ${n.aiSummary || n.content.substring(0, 100)}`).join("\n") || "No notices"}

TODAY'S CANTEEN MENU:
${menu ? `
Breakfast: ${menu.breakfast.map(i => `${i.name} (₹${i.price})`).join(", ")}
Lunch: ${menu.lunch.map(i => `${i.name} (₹${i.price})`).join(", ")}
Snacks: ${menu.snacks.map(i => `${i.name} (₹${i.price})`).join(", ")}
` : "Menu not updated yet today"}

UNRESOLVED LOST & FOUND ITEMS:
${lostItems.map(i => `- [${i.type.toUpperCase()}] ${i.itemName}: ${i.description}`).join("\n") || "No items"}

STUDENT ATTENDANCE:
${attendance.map(a => `- ${a.subject}: ${a.percentage}% (${a.percentage >= 75 ? "Safe" : "Danger!"})`).join("\n") || "No attendance records"}

Answer questions naturally and helpfully. Keep answers short and friendly.
If asked something you don't know, say so honestly.
    `;
  } catch (error) {
    return "You are CampusAI, a helpful college assistant.";
  }
};

// Chat with AI
export const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const systemPrompt = await getCampusContext(req.user._id);
    const groq = getGroq();

    // Build conversation history
    const messages = [
      ...(history || []).slice(-6), // last 6 messages for context
      { role: "user", content: message }
    ];

    const res2 = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = res2.choices[0].message.content;

    res.json({
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Quick Questions (suggested prompts)
export const getQuickQuestions = async (req, res) => {
  try {
    res.json({
      questions: [
        "What's for lunch today? 🍽️",
        "Any important notices? 📢",
        "Show my attendance status 📊",
        "Any lost items found? 🔍",
        "Am I safe in all subjects? ✅",
        "What events are happening? 🎉",
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};