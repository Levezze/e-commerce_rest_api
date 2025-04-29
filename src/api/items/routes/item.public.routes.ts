import { Router, NextFunction, Request, Response } from 'express';
import * as itemController from '../controllers/item.public.controller.js';

const router = Router();

router.get('/', itemController.getItems);

export default router;