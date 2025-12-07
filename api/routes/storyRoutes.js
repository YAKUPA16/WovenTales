// [Backend] api/routes/storyRoutes.js
const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.post('/', storyController.createStory);
router.get('/:id', storyController.getStory);

router.get('/', storyController.getAllPrompts);
router.get('/type/ongoing', storyController.getOngoingStories);
router.get('/type/finished', storyController.getFinishedStories);

module.exports = router;

