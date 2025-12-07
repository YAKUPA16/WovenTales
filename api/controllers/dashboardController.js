// [Backend] api/controllers/dashboardController.js
const Prompt = require("../models/Prompt");
const Story = require("../models/Story");
const StoryProgress = require("../models/StoryProgress");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    // 1) Daily prompts
    const prompts = await Prompt.find({ isActive: true })
      .sort({ weight: -1, updatedAt: -1 })
      .limit(5)
      .lean();

    // 2) Popular stories (top 10 by likesCount, tie-break views, newest)
    const popularStories = await Story.aggregate([
      { $match: { status: "published" } },
      { $addFields: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
      { $sort: { likesCount: -1, views: -1, createdAt: -1 } },
      { $limit: 10 }, // ✅ was 4
      {
        $project: {
          title: 1,
          genre: 1,
          coverImageUrl: 1,
          likes: 1,
          ratings: 1,
          views: 1,
          commentsCount: 1,
          likesCount: 1,
          createdAt: 1,
        },
      },
    ]);

    // 3) Readers Panel (completed stories for user) -> top 10
    const completed = await StoryProgress.find({
      user: userId,
      status: "completed",
    })
      .sort({ completedAt: -1, updatedAt: -1 })
      .limit(10) // ✅ was 4
      .populate({
        path: "story",
        select: "title genre coverImageUrl likes ratings views commentsCount",
      })
      .lean();

    const completedStories = completed.map((x) => x.story).filter(Boolean);

    return res.json({ prompts, popularStories, completedStories });
  } catch (e) {
    return res.status(500).json({ message: "Dashboard error", error: e.message });
  }
};
