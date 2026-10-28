import { Router } from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  resolveItem,
} from '../controllers/itemController.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.js';
import { uploadItemImage } from '../middlewares/upload.js';

const router = Router();

router.get('/', optionalAuth, getItems);
router.get('/:id', optionalAuth, getItemById);
router.post('/', requireAuth, uploadItemImage, createItem);
router.put('/:id', requireAuth, uploadItemImage, updateItem);
router.delete('/:id', requireAuth, deleteItem);
router.post('/:id/resolve', requireAuth, resolveItem);

export default router;

