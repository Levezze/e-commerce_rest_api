import express from 'express';
import cors from 'cors';
import { ExpressAuth } from '@auth/express';

export const app = express();
const PORT = 3000;

app.use(cors());