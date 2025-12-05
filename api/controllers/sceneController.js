const Scene = require('../models/Scene');

exports.createScene = async (req, res) => {
    const { storyId, parentId, text } = req.body;
    const author = req.user ? req.user._id : null;

    try {
        // if parentId provided, verify that parent is not an ending
        if (parentId) {
            const parentScene = await Scene.findById(parentId);
            if (!parentScene) return res.status(400).json({ error: 'Parent scene not found' });
            if (parentScene.hasEnded) return res.status(400).json({ error: 'Cannot add a child to an ending scene' });
        }

        const scene = await Scene.create({ storyId, parentId: parentId || null,  author, text });
        res.status(201).json(scene);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create scene' });
    }
};

exports.getChildren = async (req, res) => {
    const sceneId = req.params.id;
    try {
        const children = await Scene.find({ parentId: sceneId }).populate('author', 'username');
        res.status(200).json(scenes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve child scenes' });
    }   
};

exports.togglelike = async (req, res) => {
    const sceneId = req.params.id;
    const userId = req.user ? req.user._id : null;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    try {
        const scene = await Scene.findById(sceneId);
        if (!scene) return res.status(404).json({ error: 'Scene not found' });

        const idx = scene.likes.findindexOf(id => id.toString() === userId.toString());
        if (idx === -1) {
            scene.likes.push(userId);
        } else {
            scene.likes.splice(idx, 1);
        }
        await scene.save();
        res.status(200).json({ likesCount: scene.likes.length, liked: idx === -1 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

exports.markEnding = async (req, res) => {
    const sceneId = req.params.id;
    const userId = req.user ? req.user._id : null;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });
    try {
        const scene = await Scene.findById(sceneId);
        if (!scene) return res.status(404).json({ error: 'Scene not found' });
        if (scene.author.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'Only the author can mark this scene as an ending' });
        }
        scene.hasEnded = true;
        await scene.save();
        res.status(200).json({ message: 'Scene marked as an ending' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark scene as an ending' });
    }
};

exports.getScene = async (req, res) => {
    try {
        const scene = await Scene.findById(req.params.id).populate('author', 'username');
        if (!scene) return res.status(404).json({ error: 'Scene not found' });
        res.status(200).json(scene);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve scene' });
    }
};