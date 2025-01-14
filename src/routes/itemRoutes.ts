import { Router } from 'express';
import {
  createItemController,
  deleteItemController,
  findItemController,
  getItemsController,
  updateItemController,
} from '../api/items/itemController';

const router = Router();

router.post('/', createItemController);
router.get('/', getItemsController);
router.get('/:id', findItemController);
router.put('/:id', updateItemController);
router.delete('/:id', deleteItemController);

export default router;
