const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const sceneController = require('../controllers/sceneController');

// STORY ROUTES
router.post('/', storyController.createStory);

// 1) Prompts
router.get('/prompts/all', storyController.getAllPrompts);

// 2) Continuing stories
router.get('/stories/continuing', storyController.getContinuingStories);

// 3) Finished stories
router.get('/stories/finished', storyController.getFinishedStories);

// 4) Full story + its scenes
router.get('/:id', storyController.getStoryWithScenes);

// SCENE ROUTES
router.post('/:storyId/scene', sceneController.createScene);

module.exports = router;
