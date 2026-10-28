import { Router } from 'express';
import {
  getThreads,
  getThreadById,
  sendMessage,
  createOrGetThread,
  markThreadRead,
} from '../controllers/messageController.js';
import { optionalAuth, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', optionalAuth, getThreads);
router.post('/thread', optionalAuth, createOrGetThread);
router.get('/:id', optionalAuth, getThreadById);
router.post('/:threadId/messages', optionalAuth, sendMessage);
router.put('/:threadId/read', optionalAuth, markThreadRead);

export default router;

