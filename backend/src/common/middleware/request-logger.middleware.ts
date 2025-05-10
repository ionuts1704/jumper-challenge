import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { winstonLogger } from '../logger';

@Injectable()
export class RequestLoggerMiddleware
  implements NestMiddleware<Request, Response>
{
  private readonly logger = winstonLogger;

  public use(request: Request, response: Response, next: NextFunction): void {
    // Log the incoming request
    const fullUrl = `${request.protocol}://${request.get('host')}${request.originalUrl}`;
    const startTime = Date.now();

    // Use the middleware class name as context
    const requestContext = RequestLoggerMiddleware.name;

    setImmediate(() => {
      this.logger.info({
        context: requestContext,
        message: `RequestSent: [${request.method}] ${fullUrl}`,
        body: request.body,
      });
    });

    // Capture the original response methods
    const originalSend = response.send;
    const originalJson = response.json;

    // Override response.send
    response.send = function (body: any): Response {
      const responseTime = Date.now() - startTime;

      setImmediate(() => {
        winstonLogger.info({
          context: requestContext,
          message: `ResponseSent: [${request.method}] ${fullUrl}`,
          statusCode: response.statusCode,
          responseTime: `${responseTime}ms`,
          body: typeof body === 'string' ? body : JSON.stringify(body),
        });
      });

      return originalSend.call(this, body);
    };

    // Override response.json
    response.json = function (body: any): Response {
      const responseTime = Date.now() - startTime;

      setImmediate(() => {
        winstonLogger.info({
          context: requestContext,
          message: `ResponseSent: [${request.method}] ${fullUrl}`,
          statusCode: response.statusCode,
          responseTime: `${responseTime}ms`,
          body,
        });
      });

      return originalJson.call(this, body);
    };

    // Handle errors
    response.on('error', (error) => {
      const responseTime = Date.now() - startTime;
      const statusCode =
        error instanceof HttpException ? error.getStatus() : 500;
      const errorResponse =
        error instanceof HttpException
          ? error.getResponse()
          : { message: error.message };

      setImmediate(() => {
        winstonLogger.error({
          context: requestContext,
          message: `ErrorResponse: [${request.method}] ${fullUrl}`,
          statusCode,
          responseTime: `${responseTime}ms`,
          error: errorResponse,
        });
      });
    });

    next();
  }
}
