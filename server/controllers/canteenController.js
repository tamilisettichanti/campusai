import MenuItem from "../models/MenuItem.js";

// Get Today's Menu
export const getTodayMenu = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const menu = await MenuItem.findOne({ date: today })
      .populate("updatedBy", "name");

    if (!menu) {
      return res.status(404).json({ message: "Menu not updated yet for today" });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Menus
export const getAllMenus = async (req, res) => {
  try {
    const menus = await MenuItem.find()
      .populate("updatedBy", "name")
      .sort({ createdAt: -1 })
      .limit(7);
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create / Update Today's Menu
export const upsertMenu = async (req, res) => {
  try {
    const { breakfast, lunch, snacks } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const day = new Date().toLocaleDateString("en-US", { weekday: "long" });

    const menu = await MenuItem.findOneAndUpdate(
      { date: today },
      {
        day,
        date: today,
        breakfast: breakfast || [],
        lunch: lunch || [],
        snacks: snacks || [],
        updatedBy: req.user._id,
      },
      { upsert: true, new: true }
    ).populate("updatedBy", "name");

    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};