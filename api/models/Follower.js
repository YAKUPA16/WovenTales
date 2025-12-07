const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // follower
  following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // user being followed
}, { timestamps: true });

module.exports = mongoose.model("Follower", followerSchema, "following"); // use your existing collection
