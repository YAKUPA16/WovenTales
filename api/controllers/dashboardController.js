// [Backend] api/controllers/dashboardController.js
const Story = require("../models/Story");
const Scene = require("../models/Scene");
const User = require("../models/User");
const Prompt = require("../models/Prompt");


exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;

    // 1) Daily prompts
    const prompts = await Prompt.find({ isActive: true })
      .sort({ weight: -1, updatedAt: -1 })
      .limit(5)
      .lean();

    // 2) Popular stories
    const popularStories = await Story.aggregate([
      { $match: { } },
      { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { likesCount: -1, views: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          title: 1,
          coverImageUrl: 1,
          likes: 1,
          likesCount: 1,
          views: 1,
          createdAt: 1,
        },
      },
    ]);

    // 3) Reader Panel: latest 10 published stories (independent of user)
    const readerPanelStories = await Story.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .then((stories) =>
        stories.map((s) => ({
          ...s,
          likesCount: Array.isArray(s.likes) ? s.likes.length : 0,
        }))
      );

    return res.json({ prompts, popularStories, completedStories: readerPanelStories, // renamed to match frontend's expected key
});

  } catch (e) {
    return res.status(500).json({ message: "Dashboard error", error: e.message });
  }
};
