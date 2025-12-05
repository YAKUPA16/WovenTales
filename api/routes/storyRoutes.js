const express= require('express');
const router= express.Router();
const storyController= require('../controllers/storyController');

router.post('/', storiesController.createStory);
router.get('/:id', storiesController.getStory);

module.exports = router;