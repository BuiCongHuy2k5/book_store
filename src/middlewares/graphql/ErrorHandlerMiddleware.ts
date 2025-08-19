import {
  ArgumentValidationError,
  ForbiddenError,
  MiddlewareInterface,
  NextFn,
  ResolverData,
  UnauthorizedError,
} from 'type-graphql';
import winston from 'winston';
import { Response } from 'express';
import { Service } from 'typedi';

import { Logger } from '@Decorators/Logger';
import { GraphqlContext } from '@Libs/types/GraphqlContext';
import { BusinessLogicError } from '@Errors/BusinessLogicError';

@Service()
export class ErrorHandlerMiddleware implements MiddlewareInterface<GraphqlContext> {
  constructor(@Logger(module) private readonly logger: winston.Logger) {}

  async use({ context, info }: ResolverData<any>, next: NextFn) {
    const { res, req } = context;

    try {
      return await next();
    } catch (error) {
      this.logger.error('❌ Error occurred:', error);

      const path = req?.originalUrl || 'GraphQL';
      const timestamp = new Date().toISOString();

      // Handle Validation Error
      if (error instanceof ArgumentValidationError) {
        const errors = error.validationErrors.map(e => ({
          field: e.property,
          constraints: e.constraints,
        }));

        res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'VALIDATION ERROR',
          errors,
          path,
          timestamp,
        });
        return;
      }

      // Handle Unauthorized
      if (error instanceof UnauthorizedError) {
        res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Unauthorized',
          path,
          timestamp,
        });
        return;
      }

      // Handle Forbidden
      if (error instanceof ForbiddenError) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: 'Forbidden',
          path,
          timestamp,
        });
        return;
      }

      // Handle Business Logic Error (custom thrown error)
      if (error instanceof BusinessLogicError) {
        res.status(422).json({
          success: false,
          statusCode: 422,
          message: error.message || 'Business logic error',
          code: error.name,
          path,
          timestamp,
        });
        return;
      }

      // Default Internal Server Error
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || 'Internal Server Error',
        code: error.name || 'INTERNAL_ERROR',
        path,
        timestamp,
      });
    }
  }
}
