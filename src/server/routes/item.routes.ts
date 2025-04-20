import express, { NextFunction, Request, Response } from 'express';
import { createItem } from '../controllers/item.controller';

const router = express.Router();

router.post('/items', itemController.createItem);

export default router;