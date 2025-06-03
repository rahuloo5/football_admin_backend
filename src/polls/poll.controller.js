const Poll = require('../../db/models/polls.model');

const createPoll = async (req, res) => {
  try {
    const poll = new Poll(req.body);
    const savedPoll = await poll.save();
    res.status(201).json(savedPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPolls = async (req, res) => {

  try {
    const quizzes = await Poll.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.status(200).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.status(200).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.status(200).json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createPoll,
  getAllPolls,
  getPollById,
  updatePoll,
  deletePoll
};