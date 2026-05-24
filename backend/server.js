import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Route imports
import authRoutes from './routes/auth.js';
import propertyRoutes from './routes/property.js';
import wishlistRoutes from './routes/wishlist.js';
import contactRoutes from './routes/contact.js';
import feedbackRoutes from './routes/feedback.js';

const app = express(); //created app using Express Package

app.get('/', (req, res)=> res.send('API is working') )

const allowedOrigins = ['http://localhost:5173', 'http://192.168.1.42']

// ─── Middleware ──────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json());
app.use(cors({
   origin: allowedOrigins,
   credentials: true,                 // ← required for cookies 
  }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── 404 handler ────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ─── Error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ─── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
