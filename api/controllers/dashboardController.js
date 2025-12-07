// [Backend] api/controllers/dashboardController.js
const Prompt = require("../models/Prompt");
const Story = require("../models/Story");
const StoryProgress = require("../models/StoryProgress");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    // 1) Daily prompts (top 5 active)
    const prompts = await Prompt.find({ isActive: true })
      .sort({ weight: -1, updatedAt: -1 })
      .limit(5)
      .lean();

    // 2) Popular stories (top 10 by likesCount, newest tie-break)
    const popularStories = await Story.aggregate([
      // Calculate likesCount if "likes" array exists
      { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          coverImageURL: 1,
          averageRating: 1,
          ratingCount: 1,
          createdAt: 1,
        },
      },
    ]);

    // 3) Completed stories for user (top 10)
    const completed = await StoryProgress.find({
      user: userId,
      status: "completed",
    })
      .sort({ completedAt: -1, updatedAt: -1 })
      .limit(10)
      .populate({
        path: "story",
        select: "title coverImageURL averageRating ratingCount createdAt",
      })
      .lean();

    const completedStories = completed.map((x) => x.story).filter(Boolean);

    return res.json({ prompts, popularStories, completedStories });
  } catch (e) {
    console.error("Dashboard error:", e);
    return res.status(500).json({ message: "Dashboard error", error: e.message });
  }
};
