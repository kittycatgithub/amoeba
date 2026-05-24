import Feedback from '../models/Feedback.js';
import { validationResult } from 'express-validator';

// ─── Submit Feedback ────────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, rating, message } = req.body;

    const feedback = await Feedback.create({
      name,
      email: email.toLowerCase(),
      rating: Number(rating),
      message,
    });

    res.status(201).json({ message: 'Thank you for your feedback!', feedback });
  } catch (err) {
    console.error('submitFeedback error:', err);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

// ─── Get All Feedback ───────────────────────────────────────
export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (err) {
    console.error('getFeedback error:', err);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
};
