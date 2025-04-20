import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes';
import { errorHandler } from './middlewares/error.middleware';
import { ExpressAuth } from '@auth/express';

const app = express();
app.use(cors());

app.use('/api/items', itemRoutes);

app.use(errorHandler);

export default app;