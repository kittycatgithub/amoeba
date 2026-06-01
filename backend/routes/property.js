import express from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { auth, requireRole } from '../middleware/auth.js';

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
  propertyController.createProperty
);

router.put(
  '/:id',
  auth,
  requireRole(...posterRoles),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  auth,
  requireRole(...posterRoles),
  propertyController.deleteProperty
);

export default router;