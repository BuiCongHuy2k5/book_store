import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { Service } from 'typedi';

import { Logger } from '@Decorators/Logger';

@Service()
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  constructor(@Logger(module) private logger: winston.Logger) {}

  error(error: any, req: Request, res: Response, next: NextFunction): void {
    const status = error.httpCode || error.status || 500;

    // Nếu là lỗi validate
    if (Array.isArray(error?.errors) && error?.name === 'BadRequestError') {
      const detailedErrors = error.errors.map((err: any) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        errors: detailedErrors,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
      });
      return;
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      message: error.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
    });
  }
}
