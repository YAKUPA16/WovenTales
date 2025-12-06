const Story = require('../models/Story');
const Scene = require('../models/Scene');

// CREATE STORY
exports.createStory = async (req, res) => {
    try {
        const story = await Story.create(req.body);
        return res.json(story);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create story' });
    }
};

// 1) GET ALL PROMPTS (title + prompt only)
exports.getAllPrompts = async (req, res) => {
    try {
        const stories = await Story.find({}, 'title prompt coverImageURL');
        return res.json(stories);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch prompts' });
    }
};

// 2) GET CONTINUING STORIES
exports.getContinuingStories = async (req, res) => {
    try {
        const ongoing = await Scene.aggregate([
            { $match: { hasEnded: false } },
            { $group: { _id: "$storyId" } }
        ]);

        const storyIds = ongoing.map(s => s._id);

        const stories = await Story.find({ _id: { $in: storyIds } });

        return res.json(stories);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch continuing stories' });
    }
};

// 3) GET FINISHED STORIES
exports.getFinishedStories = async (req, res) => {
    try {
        const stories = await Story.find();

        const result = [];

        for (const story of stories) {
            const scenes = await Scene.find({ storyId: story._id });

            const allEnded = scenes.length > 0 && scenes.every(s => s.hasEnded === true);

            if (allEnded) result.push(story);
        }

        return res.json(result);

    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch finished stories' });
    }
};

// 4) GET STORY + ALL SCENES (full reading mode)
exports.getStoryWithScenes = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        const scenes = await Scene.find({ storyId: req.params.id });

        return res.json({ story, scenes });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch story' });
    }
};
