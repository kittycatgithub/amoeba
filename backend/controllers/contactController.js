import Contact from '../models/Contact.js';
import { validationResult } from 'express-validator';

// ─── Submit Contact Form ────────────────────────────────────
export const submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, phone, subject, message, property } = req.body;

    const contact = await Contact.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject,
      message,
      property: property || null,
    });

    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (err) {
    console.error('submitContact error:', err);
    res.status(500).json({ message: 'Failed to submit contact form' });
  }
};

// ─── Get All Contacts (protected) ───────────────────────────
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('property', 'title city')
      .sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (err) {
    console.error('getContacts error:', err);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};
