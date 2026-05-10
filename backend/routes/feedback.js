const express = require('express');
const { body } = require('express-validator');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  feedbackController.submitFeedback
);

router.get('/', feedbackController.getFeedback);

module.exports = router;
