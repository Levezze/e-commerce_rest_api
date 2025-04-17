import express from 'express';
import cors from 'cors';
import { ExpressAuth } from '@auth/express';

const app = express();
app.use(cors());

export default app;