import { Router, NextFunction, Request, Response } from 'express';
import * as itemController from '../controllers/item.admin.controller.js';

const router = Router();

router.post('/', itemController.createItem);

export default router;