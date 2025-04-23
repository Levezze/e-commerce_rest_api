import * as dotenv from 'dotenv';
dotenv.config();
console.log(`[DEBUG] LOG_LEVEL read in index.ts: ${process.env.LOG_LEVEL}`);


import app from './app.js';
import { logger } from './utils/logger.js';

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`App running on port: ${PORT}`);
});

