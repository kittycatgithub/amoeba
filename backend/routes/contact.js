import express from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contactController.js';
import { auth } from '../middleware/auth.js';

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

export default router;