const express = require('express');
const router = express.Router();
const scenesController = require('../controllers/scenesController');

router.post('/', scenesController.createScene);
router.get('/:id/children', scenesController.getChildren);
router.get('/:id', scenesController.getScene);
router.get('/', scenesController.getScenesByStory);
router.post('/:id/like', scenesController.toggleLike);
router.post('/:id/end', scenesController.markEnding);

module.exports = router;