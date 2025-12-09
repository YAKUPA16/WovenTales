const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const explorerController = require("../controllers/explorerController");

router.get("/stories", protect, explorerController.getExploreStories);

module.exports = router;
