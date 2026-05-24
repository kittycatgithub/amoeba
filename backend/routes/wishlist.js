import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All wishlist routes are protected — user must be logged in
router.get('/',                auth, wishlistController.getWishlist);
router.post('/:propertyId',    auth, wishlistController.addToWishlist);
router.delete('/:propertyId',  auth, wishlistController.removeFromWishlist);
router.delete('/',             auth, wishlistController.clearWishlist);  // for "Clear All"

export default router;