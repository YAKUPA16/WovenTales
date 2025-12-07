const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Like", LikeSchema);
