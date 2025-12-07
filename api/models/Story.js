const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rootScene: { type: mongoose.Schema.Types.ObjectId, ref: 'Scene', default: null },
    coverImageURL: { type: String, default: '' },
    // Rating summary fields (not individual ratings)
    averageRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
