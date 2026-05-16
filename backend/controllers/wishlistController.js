const Wishlist = require('../models/Wishlist');

// ─── Get Wishlist ────────────────────────────────────────────
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate('property')   // returns full property objects
      .sort({ createdAt: -1 });

    // Frontend slice expects an array of property ID strings
    const wishlist = items.map(item => item.property._id.toString());

    res.json({ wishlist });
  } catch (err) {
    console.error('getWishlist error:', err);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};

// ─── Add to Wishlist ─────────────────────────────────────────
exports.addToWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // insertOne — unique index handles duplicate silently
    await Wishlist.create({ user: req.user._id, property: propertyId });

    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — already wishlisted, not an error for the client
      return res.status(200).json({ message: 'Already in wishlist' });
    }
    console.error('addToWishlist error:', err);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

// ─── Remove from Wishlist ────────────────────────────────────
exports.removeFromWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    await Wishlist.findOneAndDelete({ user: req.user._id, property: propertyId });

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('removeFromWishlist error:', err);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};

// ─── Clear Wishlist ──────────────────────────────────────────
exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.deleteMany({ user: req.user._id });
    res.json({ message: 'Wishlist cleared' });
  } catch (err) {
    console.error('clearWishlist error:', err);
    res.status(500).json({ message: 'Failed to clear wishlist' });
  }
};