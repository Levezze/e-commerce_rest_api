import { Router, NextFunction, Request, Response } from 'express';
import * as itemController from '../controllers/item.controller';

const router = Router();

router.get('/', itemController.getItems);
router.post('/', itemController.createItem);

export default router;