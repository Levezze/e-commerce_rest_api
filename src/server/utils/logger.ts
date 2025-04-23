import { pino } from 'pino';
import { pinoHttp } from 'pino-http';
import { Request, Response } from 'express';

const logLevel = process.env.LOG_LEVEL || 'info';

const pinoOptions: pino.LoggerOptions = {
  level: logLevel,
  base: {
    pid: false,
    hostname: false,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
};

export const logger = pino(pinoOptions);

export const httpLogger = pinoHttp({
  logger: logger,
  serializers: {
    req(req: Request) {
      return {
        method: req.method,
        url: req.originalUrl || req.url,
        remoteAddress: req.ip || req.socket?.remoteAddress,
        userAgent: req.headers['user-agent']?.substring(0, 70) + '...',
      };
    },
    res(res: Response) {
      return {
        statusCode: res.statusCode,
      }
    },
  }
});

logger.info(`Logger initialized with level: ${logLevel}`);
