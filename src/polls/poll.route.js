const express = require('express');
const router = express.Router();
const pollController = require('./poll.controller');

router.post('/poll', pollController.createPoll);

router.get('/polls', pollController.getAllPolls);

router.get('/poll/:id', pollController.getPollById);

router.put('/poll/:id', pollController.updatePoll);

router.delete('/poll/:id', pollController.deletePoll);

module.exports = router;
