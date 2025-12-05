const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    sceneId: { type: mongoose.Schema.Types.ObjectId, ref: "Scene", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);