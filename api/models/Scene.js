const mongoose = require('mongoose');

const sceneSchema = new mongoose.Schema({
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scene', default: null },

    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },

    hasEnded: { type: Boolean, default: false },

    // people who liked the scene
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Scene', sceneSchema);
