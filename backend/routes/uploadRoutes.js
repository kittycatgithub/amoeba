// routes/uploadRoutes.js
import express from 'express';
import { getUploadSignature } from '../controllers/uploadController.js';
import { auth } from '../middleware/auth.js'; 
const router = express.Router();

router.get('/signature', auth, getUploadSignature);

export default router;