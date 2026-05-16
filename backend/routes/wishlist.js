const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All wishlist routes are protected — user must be logged in
router.get('/',                auth, wishlistController.getWishlist);
router.post('/:propertyId',    auth, wishlistController.addToWishlist);
router.delete('/:propertyId',  auth, wishlistController.removeFromWishlist);
router.delete('/',             auth, wishlistController.clearWishlist);  // for "Clear All"

module.exports = router;