const express = require('express');
const router = express.Router();
const sceneController = require('../controllers/sceneController');

router.post('/', sceneController.createScene);
router.put('/:id/end', sceneController.endScene);
router.put('/:id/like', sceneController.toggleLike);

module.exports = router;
