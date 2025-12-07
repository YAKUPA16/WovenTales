// [Backend] api/models/Story.js
const mongoose = require("mongoose");

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
    genre: { type: String, trim: true }, // used for the little pill under title
    coverImageUrl: { type: String, default: "" }, // card image
    promptRef: { type: mongoose.Schema.Types.ObjectId, ref: "Prompt" },

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    // Engagement
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // who liked
    ratings: [ratingSchema], // 1-5 per user

    // Fast query fields (computed)
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
