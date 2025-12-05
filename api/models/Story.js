const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverImageURL: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);

