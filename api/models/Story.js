const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
    title: {type: String, required: true},
    prompt: {type: String, required: true}
});

const Prompt = mongoose.model('Prompt', PromptSchema);