const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  contactController.submitContact
);

router.get('/', auth, contactController.getContacts);

module.exports = router;
