const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    tags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
