// [Backend] api/models/Prompt.js
const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    // Optional: control UI colors like the screenshot
    theme: {
      bg: { type: String, default: "#2bb6d9" }, // card background
      fg: { type: String, default: "#ffffff" }, // text color
    },
    tags: [{ type: String, trim: true }], // optional: "Sci-Fi", "Mystery"
    isActive: { type: Boolean, default: true },
    weight: { type: Number, default: 1 }, // for “daily rotation”
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptSchema);
