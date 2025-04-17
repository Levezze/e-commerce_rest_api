import app from './app';
import { logger } from './utils/logger';

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`App running on port: ${PORT}`);
});
