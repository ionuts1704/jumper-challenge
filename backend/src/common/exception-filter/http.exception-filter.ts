import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { winstonLogger } from '../logger';
import { ErrorDto } from '../dto/error.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = winstonLogger;
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorResponse: ErrorDto = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: ['Internal server error'],
      error: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const status = exception.getStatus();

      errorResponse.statusCode = status;

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if ('message' in exceptionResponse) {
          errorResponse.message = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message
            : [String(exceptionResponse.message)];
        } else {
          errorResponse.message = [String(exceptionResponse)];
        }

        if (
          'error' in exceptionResponse &&
          typeof exceptionResponse.error === 'string'
        ) {
          errorResponse.error = exceptionResponse.error;
        } else {
          errorResponse.error = HttpStatus[status] || 'Error';
        }
      } else {
        errorResponse.message = [String(exceptionResponse)];
        errorResponse.error = HttpStatus[status] || 'Error';
      }
    } else {
      this.logger.error({
        message:
          exception instanceof Error ? exception.message : 'Unknown error',
        stack: exception instanceof Error ? exception.stack : undefined,
      });
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    httpAdapter.reply(response, errorResponse, httpStatus);
  }
}
