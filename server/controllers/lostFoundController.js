import LostItem from "../models/LostItem.js";
import Groq from "groq-sdk";

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Match Finder
const findAIMatch = async (newItem, existingItems) => {
  try {
    if (existingItems.length === 0) return null;

    const groq = getGroq();
    const itemsList = existingItems.map(item =>
      `ID: ${item._id}, Name: ${item.itemName}, Description: ${item.description}`
    ).join("\n");

    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `A ${newItem.type === "lost" ? "FOUND" : "LOST"} item was posted:
Name: ${newItem.itemName}
Description: ${newItem.description}

Check if any of these ${newItem.type === "lost" ? "lost" : "found"} items match:
${itemsList}

Reply with ONLY the matching item ID or "none". Nothing else.`
      }]
    });

    const matchId = res.choices[0].message.content.trim();
    if (matchId === "none" || !matchId) return null;

    const matched = existingItems.find(i => i._id.toString() === matchId);
    return matched ? matched._id : null;
  } catch (error) {
    return null;
  }
};

// Post Lost or Found Item
export const postItem = async (req, res) => {
  try {
    const { type, itemName, description, location } = req.body;

    // Find opposite type items for matching
    const oppositeType = type === "lost" ? "found" : "lost";
    const existingItems = await LostItem.find({
      type: oppositeType,
      resolved: false
    });

    const aiMatchId = await findAIMatch(
      { type, itemName, description },
      existingItems
    );

    const item = await LostItem.create({
      type,
      itemName,
      description,
      location,
      postedBy: req.user._id,
      aiMatchId: aiMatchId || null,
    });

    const populated = await item.populate("postedBy", "name email");

    // If match found, update the matched item too
    if (aiMatchId) {
      await LostItem.findByIdAndUpdate(aiMatchId, { aiMatchId: item._id });
    }

    res.status(201).json({
      ...populated.toObject(),
      matchFound: !!aiMatchId,
      matchMessage: aiMatchId
        ? "🎉 A possible match was found for your item!"
        : "No match found yet. We'll notify you if someone posts a match!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Items
export const getItems = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};

    const items = await LostItem.find(query)
      .populate("postedBy", "name email")
      .populate("aiMatchId")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark as Resolved
export const resolveItem = async (req, res) => {
  try {
    const item = await LostItem.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};