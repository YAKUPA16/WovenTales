// [Backend] api/models/Story.js
const mongoose = require("mongoose");

// rating subdocument
const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, min: 1, max: 5, required: true },
  },
  { _id: false, timestamps: true }
);

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    genre: { type: String, trim: true }, // optional tag/pill

    // Entry point for interactive stories
    firstScene: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scene",
      default: null,
    },

    coverImageUrl: { type: String, default: "" }, // card image
storyText:{ type: String, default: "" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    // Linear story text (for non-branching or summary)
    text: { type: String, default: "" },

    // Engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    ratings: [ratingSchema],

    commentsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// convenience virtual: average rating
storySchema.virtual("avgRating").get(function () {
  if (!this.ratings?.length) return 0;
  const sum = this.ratings.reduce((a, r) => a + r.value, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10; // 1 decimal
});

module.exports = mongoose.model("Story", storySchema);
