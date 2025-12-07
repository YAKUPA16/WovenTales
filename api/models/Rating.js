const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  story: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Rating", ratingSchema);
