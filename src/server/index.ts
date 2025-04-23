import * as dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { logger } from './utils/logger.js';

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`App running on port: ${PORT}`);
});
