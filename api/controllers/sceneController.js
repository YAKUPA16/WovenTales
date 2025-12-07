const Scene = require('../models/Scene');
const Story = require('../models/Story');

module.exports = {

    // -------------------------------
    // 1. Add a new scene (branch)
    // -------------------------------
    createScene: async (req, res) => {
        try {
            const { storyId, parentId, author, text } = req.body;

            const newScene = new Scene({
                storyId,
                parentId,
                author,
                text
            });

            await newScene.save();

            // If this is the first scene, set it as root
            const story = await stories.findById(storyId);
            if (!story.rootScene) {
                story.rootScene = newScene._id;
                await story.save();
            }

            res.json(newScene);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // -------------------------------
    // 2. Mark a scene as End
    // -------------------------------
    endScene: async (req, res) => {
        try {
            const sceneId = req.params.id;

            const scene = await Scene.findById(sceneId);
            scene.hasEnded = true;
            await scene.save();

            res.json({ message: "Scene marked as ended", scene });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // -------------------------------
    // 3. Like / Unlike a scene
    // -------------------------------
    toggleLike: async (req, res) => {
        try {
            const sceneId = req.params.id;
            const userId = req.body.userId;

            const scene = await Scene.findById(sceneId);

            const index = scene.likes.indexOf(userId);

            if (index === -1) {
                scene.likes.push(userId);
            } else {
                scene.likes.splice(index, 1);
            }

            await scene.save();
            res.json(scene);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
