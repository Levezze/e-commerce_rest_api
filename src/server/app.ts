import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from '../middlewares/error.middleware.js';
import { httpLogger } from '../utils/logger.js';
import authRoutes from '../api/auth/auth.routes.js';
// import itemRoutesPublic from '../api/items/routes/item.public.routes.js';
// import itemRoutesAdmin from '../api/items/routes/item.admin.routes.js';
import userRoutes from '../api/users/user.routes.js';

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.use(httpLogger);

app.use('/healthcheck', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// Public Routes
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/items', itemRoutesPublic);
app.use('/api/v1/users', userRoutes);

// Admin Only Routes
// app.use('/api/v1/admin/auth', authAdminRoutes);
// app.use('/api/v1/admin/items', itemRoutesAdmin);
// app.use('/api/v1/admin/users', userAdminRoutes);

app.use(errorHandler);

export default app;