// [Backend] api/routes/sceneRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const sceneController = require("../controllers/sceneController");

// CREATE scene
router.post("/", protect, sceneController.createScene);

// GET children of a scene
router.get("/:id/children", protect, sceneController.getChildren);

// GET single scene
router.get("/:id", protect, sceneController.getScene);

// GET all scenes for a story (?story=ID)
router.get("/", protect, sceneController.getScenesByStory);

// TOGGLE like
router.post("/:id/like", protect, sceneController.toggleLike);

// MARK ending
router.post("/:id/end", protect, sceneController.markEnding);

module.exports = router;
