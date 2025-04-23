import { logger } from "./logger.js";

export const logPortListen = (PORT: number) => {
  logger.info(`App running on port: ${PORT}`);
};