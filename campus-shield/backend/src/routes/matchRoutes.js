import { Router } from 'express';
import {
  getMatches,
  getMatchById,
  verifyMatch,
  confirmMatch,
  dismissMatch,
} from '../controllers/matchController.js';
import { optionalAuth, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', optionalAuth, getMatches);
router.get('/:id', optionalAuth, getMatchById);
router.post('/:id/verify', requireAuth, verifyMatch);
router.post('/:id/confirm', requireAuth, confirmMatch);
router.delete('/:id', requireAuth, dismissMatch);

export default router;

