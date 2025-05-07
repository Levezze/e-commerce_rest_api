import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.wsl' });

import app from './app.js';
import { logPortListen } from '../utils/logServerStart.js';
console.log(`[DEBUG] LOG_LEVEL read in index.ts: ${process.env.LOG_LEVEL}`);

const PORT = 3000;

app.listen(PORT, () => {
  logPortListen(PORT);
});
