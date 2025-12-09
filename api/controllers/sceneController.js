// [Backend] api/controllers/sceneController.js
const mongoose = require("mongoose");
const Scene = require("../models/Scene");
const Story = require("../models/Story");

function isObjId(id) {
  return mongoose.isValidObjectId(id);
}

/**
 * POST /api/scenes
 * body: { storyId, parentId, content }
 */
exports.createScene = async (req, res) => {
  const { storyId, parentId, content } = req.body;
  const author = req.user ? req.user._id : null;

  if (!storyId || !isObjId(storyId)) {
    return res.status(400).json({ error: "Valid storyId is required" });
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Scene content is required" });
  }
  if (!author) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });

    let parentScene = null;
    if (parentId) {
      if (!isObjId(parentId)) {
        return res.status(400).json({ error: "Invalid parentId" });
      }
      parentScene = await Scene.findById(parentId);
      if (!parentScene) {
        return res.status(400).json({ error: "Parent scene not found" });
      }
      if (parentScene.hasEnded) {
        return res
          .status(400)
          .json({ error: "Cannot add a child to an ending scene" });
      }
    }

    const scene = await Scene.create({
      storyId,
      parentId: parentScene ? parentScene._id : null,
      author,
      content: content.trim(),
    });

    // If story has no firstScene yet, set this one as root
    if (!story.firstScene) {
      story.firstScene = scene._id;
      await story.save();
    }

    return res.status(201).json(scene);
  } catch (error) {
    console.error("createScene error:", error);
    return res.status(500).json({ error: "Failed to create scene" });
  }
};

/**
 * GET /api/scenes/:id/children
 */
exports.getChildren = async (req, res) => {
  const sceneId = req.params.id;
  if (!isObjId(sceneId)) {
    return res.status(400).json({ error: "Invalid scene id" });
  }

  try {
    const children = await Scene.find({ parentId: sceneId })
      .populate("author", "username name")
      .lean();

    return res.status(200).json(children);
  } catch (error) {
    console.error("getChildren error:", error);
    return res.status(500).json({ error: "Failed to retrieve child scenes" });
  }
};

/**
 * GET /api/scenes/:id
 */
exports.getScene = async (req, res) => {
  const sceneId = req.params.id;
  if (!isObjId(sceneId)) {
    return res.status(400).json({ error: "Invalid scene id" });
  }

  try {
    const scene = await Scene.findById(sceneId)
      .populate("author", "username name")
      .lean();

    if (!scene) return res.status(404).json({ error: "Scene not found" });

    return res.status(200).json(scene);
  } catch (error) {
    console.error("getScene error:", error);
    return res.status(500).json({ error: "Failed to retrieve scene" });
  }
};

/**
 * GET /api/scenes?story=ID
 */
exports.getScenesByStory = async (req, res) => {
  const { story } = req.query;
  if (!story || !isObjId(story)) {
    return res.status(400).json({ error: "Valid story query param is required" });
  }

  try {
    const scenes = await Scene.find({ storyId: story })
      .populate("author", "username name")
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json(scenes);
  } catch (error) {
    console.error("getScenesByStory error:", error);
    return res.status(500).json({ error: "Failed to fetch scenes for story" });
  }
};

/**
 * POST /api/scenes/:id/like  (toggle)
 */
exports.toggleLike = async (req, res) => {
  const sceneId = req.params.id;
  const userId = req.user ? req.user._id : null;

  if (!userId) return res.status(401).json({ error: "Authentication required" });
  if (!isObjId(sceneId)) {
    return res.status(400).json({ error: "Invalid scene id" });
  }

  try {
    const scene = await Scene.findById(sceneId);
    if (!scene) return res.status(404).json({ error: "Scene not found" });

    if (!Array.isArray(scene.likes)) {
      scene.likes = [];
    }

    const idx = scene.likes.findIndex(
      (id) => id.toString() === userId.toString()
    );

    let liked;
    if (idx === -1) {
      scene.likes.push(userId);
      liked = true;
    } else {
      scene.likes.splice(idx, 1);
      liked = false;
    }

    await scene.save();
    return res.status(200).json({ likesCount: scene.likes.length, liked });
  } catch (error) {
    console.error("toggleLike error:", error);
    return res.status(500).json({ error: "Failed to toggle like" });
  }
};

/**
 * POST /api/scenes/:id/end
 */
exports.markEnding = async (req, res) => {
  const sceneId = req.params.id;
  const userId = req.user ? req.user._id : null;

  if (!userId) return res.status(401).json({ error: "Authentication required" });
  if (!isObjId(sceneId)) {
    return res.status(400).json({ error: "Invalid scene id" });
  }

  try {
    const scene = await Scene.findById(sceneId);
    if (!scene) return res.status(404).json({ error: "Scene not found" });

    if (!scene.author || scene.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Only the author can mark this scene as an ending" });
    }

    scene.hasEnded = true;
    await scene.save();

    return res.status(200).json({ message: "Scene marked as an ending" });
  } catch (error) {
    console.error("markEnding error:", error);
    return res.status(500).json({ error: "Failed to mark scene as an ending" });
  }
};
