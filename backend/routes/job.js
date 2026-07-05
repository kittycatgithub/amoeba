import express from 'express';
import * as jobController from '../controllers/jobController.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected — user's own jobs (must be above /:id)
router.get('/user/my-jobs', auth, jobController.getMyJobs);

// Public
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);

// Protected — must be logged in with an appropriate role
const posterRoles = ['User', 'Owner', 'Company', 'Agent', 'Dealer', 'Builder'];

router.post(
  '/',
  auth,
  requireRole(...posterRoles),
  jobController.createJob
);

router.put(
  '/:id',
  auth,
  requireRole(...posterRoles),
  jobController.updateJob
);

router.delete(
  '/:id',
  auth,
  requireRole(...posterRoles),
  jobController.deleteJob
);

export default router;