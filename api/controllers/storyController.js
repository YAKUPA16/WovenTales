// [Backend] api/controllers/storyController.js
//const Story = require('../models/Story');
const Scene = require('../models/Scene');

module.exports = {
    // -------------------------------
    // 1. Create Story (with prompt)
    // -------------------------------
    createStory: async (req, res) => {
        try {
            const { title, prompt, author } = req.body;

            const story = new stories({
                title,
                prompt,
                author
            });

            await story.save();
            res.json(story);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ------------------------------------------------
    // 2. Get Story with complete tree (all scenes)
    // ------------------------------------------------
    getStory: async (req, res) => {
        try {
            const storyId = req.params.id;

            const story = await stories.findById(storyId)
                .populate("author", "username");

            if (!story) return res.status(404).json({ error: "Story not found" });

            const scenes = await Scene.find({ storyId });

            res.json({ story, scenes });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // --------------------------
    // 3. List of prompts
    // --------------------------
    getAllPrompts: async (req, res) => {
        try {
            const prompts = await stories.find({}, "title prompt coverImageURL");
            res.json(prompts);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // -----------------------------------------------------------
    // 4. Get finished stories (any path where a scene.hasEnded = true)
    // -----------------------------------------------------------
    getFinishedStories: async (req, res) => {
        try {
            const endedScenes = await Scene.find({ hasEnded: true });
            const storyIds = [...new Set(endedScenes.map(s => s.storyId.toString()))];

            const finishedStories = await stories.find({ _id: { $in: storyIds } });

            res.json(finishedStories);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // -----------------------------------------------------------
    // 5. Get ongoing stories (those with no ended scenes)
    // -----------------------------------------------------------
    getOngoingStories: async (req, res) => {
        try {
            const endedScenes = await Scene.find({ hasEnded: true });
            const endedIds = endedScenes.map(s => s.storyId.toString());

            const ongoing = await Story.find({ _id: { $nin: endedIds } });

            res.json(ongoing);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
