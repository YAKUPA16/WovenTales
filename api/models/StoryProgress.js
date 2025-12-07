// [Backend] api/models/StoryProgress.js
const mongoose = require("mongoose");

const storyProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },

    // Track reading/writing state
    status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" },
    completedAt: { type: Date },

    // If you have scenes later:
    lastSceneId: { type: String, default: "" },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

storyProgressSchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model("StoryProgress", storyProgressSchema);
