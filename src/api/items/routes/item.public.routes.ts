import { Router } from 'express';
import * as itemController from '../controllers/item.public.controller.js';

const router = Router();

router.get('/', itemController.handleGetItems);
router.get('/:id', itemController.handleGetItemById);

export default router;