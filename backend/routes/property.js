const express = require('express');
const propertyController = require('../controllers/propertyController');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Protected — user's own properties (must be above /:id)
router.get('/user/my-properties', auth, propertyController.getMyProperties);

// Public
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);

// Protected — must be logged in with an appropriate role
const posterRoles = ['User','Owner', 'Company', 'Agent', 'Dealer', 'Builder'];

router.post(
  '/',
  auth,
  requireRole(...posterRoles),
  upload.array('images', 6),
  propertyController.createProperty
);

router.put(
  '/:id',
  auth,
  requireRole(...posterRoles),
  upload.array('images', 6),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  auth,
  requireRole(...posterRoles),
  propertyController.deleteProperty
);

module.exports = router;
