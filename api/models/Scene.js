// models/Scene.js
const mongoose = require("mongoose");

const SceneSchema = new mongoose.Schema(
  {
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Scene", default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },

    choices: [
      {
        text: { type: String, required: true },
        nextScene: { type: mongoose.Schema.Types.ObjectId, ref: "Scene" },
      },
    ],

    hasEnded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scene", SceneSchema);