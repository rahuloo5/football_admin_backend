const express = require('express');
const router = express.Router();
const quizController = require('./quiz.controller');

router.post('/quiz', quizController.createQuiz);

router.get('/quizzes', quizController.getAllQuizzes);

router.get('/quiz/:id', quizController.getQuizById);

router.put('/quiz/:id', quizController.updateQuiz);

router.delete('/quiz/:id', quizController.deleteQuiz);

module.exports = router;
