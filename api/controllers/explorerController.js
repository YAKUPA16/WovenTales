// [Backend] api/controllers/explorerController.js
const Story = require("../models/Story");

exports.getExploreStories = async (req, res) => {
  try {
    const stories = await Story.find({})
      .sort({ createdAt: -1 })
      .populate("author", "username name")
      .lean({ virtuals: true }); 

    return res.json({ stories });
  } catch (e) {
    res.status(500).json({ message: "Failed to load stories", error: e.message });
  }
};

