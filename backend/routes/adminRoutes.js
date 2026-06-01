import express from 'express'
import { adminLogin, adminLogout, isAdminAuth } from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';

// Create router using express 
const adminRouter = express.Router()

// In created router, create different API endpoints
adminRouter.post('/login', adminLogin);
adminRouter.get('is-auth', authAdmin, isAdminAuth);
adminRouter.get('logout', adminLogout);

export default adminRouter;