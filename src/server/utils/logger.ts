import { pino } from 'pino';
import PinoHttp, { pinoHttp } from 'pino-http';
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

// Old manual Logger
// import { Request, Response, NextFunction } from "express";
// import { logger } from "../utils/logger";

// export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
//   const startTime = process.hrtime();

//   // Log incoming request
//   logger.info({
//     req: {
//       method: req.method,
//       url: req.originalUrl || req.url,
//       remoteAddress: req.ip || req.socket.remoteAddress,
//       userAgent: req.headers['user-agent'],
//     }
//   }, `${req.method} ${req.originalUrl || req.url}`);

//   res.on('finish', () => {
//     const diff = process.hrtime(startTime);
//     const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
//     // Log response
//     logger.info({
//       req: {
//         method: req.method,
//         url: req.originalUrl || req.url,
//       },
//       res: {
//         statusCode: res.statusCode,
//         contentLength: res.getHeader('content-length'),
//       },
//       responseTimeMs: parseFloat(durationMs),
//     }, `${req.method} ${req.originalUrl || req.url} ${res.statusCode} ${durationMs}ms`);
//   });

//   next();
// };