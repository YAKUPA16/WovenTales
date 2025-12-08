// [Backend] api/controllers/dashboardController.js
const Story = require("../models/Story");
const Scene = require("../models/Scene");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    // Dashboard data (popular / reader panel) should be viewable without authentication.
    // `req.user` may be present when a client is logged in, but it's not required.
    const userId = req.user?._id;

    // 1) Popular stories (top 10 by likesCount, tie-break views, newest)
    const popularStories = await Story.aggregate([
      { $match: { } },
      { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { likesCount: -1, views: -1, createdAt: -1 } },
      { $limit: 25 },
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

    // 2) Reader Panel: latest 10 published stories (independent of user)
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

    return res.json({
  prompts: [], // keep empty or add later if you implement prompts
  popularStories,
  completedStories: readerPanelStories, // renamed to match frontend's expected key
});

  } catch (e) {
    return res.status(500).json({ message: "Dashboard error", error: e.message });
  }
};
