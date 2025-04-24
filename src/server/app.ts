import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import { httpLogger } from '../utils/logger.js';
import authRoutes from './routes/auth.routes.js';
import itemRoutes from './routes/item.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(httpLogger);

app.use('/healthcheck', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/items', itemRoutes);
app.use('/api/v1/users', userRoutes);

app.use(errorHandler);

export default app;