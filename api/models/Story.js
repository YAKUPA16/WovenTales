// models/Story.js
const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstScene: { type: mongoose.Schema.Types.ObjectId, ref: "Scene", default: null },
    coverImageUrl: { type: String },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", StorySchema);
