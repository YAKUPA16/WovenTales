const Story = require('../models/Story');

exports.createStory = async (requestAnimationFrame, res) => {
    const { title, prompt } = req.body;
    const author = req.user ? req.user._id : null;
    try {
        const story = await Story.create({ title, prompt, author });
        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create story' });
    }
};

exports.getStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('author', 'username');
        if (!story) return res.status(404).json({ error: 'Story not found' });
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve story' });
    }
};