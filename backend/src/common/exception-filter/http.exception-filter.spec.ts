import {
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { winstonLogger } from '../logger';
import { HttpExceptionFilter } from './http.exception-filter';
import { ErrorDto } from '../dto/error.dto';

describe('HttpExceptionFilter', () => {
  let exceptionFilter: HttpExceptionFilter;
  let mockHttpAdapterHost: jest.Mocked<HttpAdapterHost<any>>;
  // Define a partial logger type with only what we need
  let mockLogger: { error: jest.Mock };

  beforeEach(async () => {
    mockHttpAdapterHost = {
      httpAdapter: {
        reply: jest.fn(),
      },
    } as jest.Mocked<HttpAdapterHost<any>>;

    mockLogger = {
      error: jest.fn(),
    };

    jest.spyOn(winstonLogger, 'error').mockImplementation(mockLogger.error);

    const module = await Test.createTestingModule({
      providers: [
        HttpExceptionFilter,
        {
          provide: HttpAdapterHost,
          useValue: mockHttpAdapterHost,
        },
      ],
    }).compile();

    exceptionFilter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  const createMockArgumentsHost = () => ({
    switchToHttp: () => ({
      getResponse: () => ({}),
      getRequest: () => ({}),
    }),
  });

  describe('Standard HttpException Handling', () => {
    it('should handle BadRequestException with array of messages', () => {
      const mockException = new BadRequestException(['Invalid input']);
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Invalid input'],
        error: 'Bad Request',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.BAD_REQUEST,
      );
    });

    it('should handle NotFoundException with single message', () => {
      const mockException = new NotFoundException('Resource not found');
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Resource not found'],
        error: 'Not Found',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.NOT_FOUND,
      );
    });

    it('should handle UnauthorizedException', () => {
      const mockException = new UnauthorizedException('Unauthorized access');
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['Unauthorized access'],
        error: 'Unauthorized',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.UNAUTHORIZED,
      );
    });

    it('should handle ForbiddenException', () => {
      const mockException = new ForbiddenException('Access denied');
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Access denied'],
        error: 'Forbidden',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.FORBIDDEN,
      );
    });
  });

  describe('Complex HttpException Scenarios', () => {
    it('should handle HttpException with custom response object', () => {
      const mockException = new HttpException(
        {
          message: ['Custom validation error'],
          error: 'Validation Failed',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: ['Custom validation error'],
        error: 'Validation Failed',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    });

    it('should handle HttpException with string response', () => {
      const mockException = new HttpException(
        'Plain error message',
        HttpStatus.BAD_GATEWAY,
      );
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.BAD_GATEWAY,
        message: ['Plain error message'],
        error: 'BAD_GATEWAY',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.BAD_GATEWAY,
      );
    });

    it('should handle HttpException with non-string, non-array message', () => {
      const mockException = new HttpException(
        { someKey: 'some value' },
        HttpStatus.CONFLICT,
      );
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.CONFLICT,
        message: ['[object Object]'],
        error: 'CONFLICT',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.CONFLICT,
      );
    });
  });

  describe('Non-HttpException Handling', () => {
    it('should handle generic Error', () => {
      const mockError = new Error('Unexpected error');
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockError, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Internal server error'],
        error: 'Internal Server Error',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      expect(mockLogger.error).toHaveBeenCalledWith({
        message: mockError.message,
        stack: mockError.stack,
      });
    });

    it('should handle null or undefined exception', () => {
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(null, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Internal server error'],
        error: 'Internal Server Error',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      expect(mockLogger.error).toHaveBeenCalledWith({
        message: 'Unknown error',
        stack: undefined,
      });
    });

    it('should handle custom error without message', () => {
      const mockError = new Error();
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockError, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Internal server error'],
        error: 'Internal Server Error',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      expect(mockLogger.error).toHaveBeenCalledWith({
        message: '',
        stack: mockError.stack,
      });
    });
  });

  describe('Edge Case Handling', () => {
    it('should handle InternalServerErrorException', () => {
      const mockException = new InternalServerErrorException('Critical error');
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['Critical error'],
        error: 'Internal Server Error',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });

    it('should handle ConflictException', () => {
      const mockException = new ConflictException('Resource conflict');
      const mockHost = createMockArgumentsHost();

      exceptionFilter.catch(mockException, mockHost as any);

      const expectedResponse: ErrorDto = {
        statusCode: HttpStatus.CONFLICT,
        message: ['Resource conflict'],
        error: 'Conflict',
      };

      expect(mockHttpAdapterHost.httpAdapter.reply).toHaveBeenCalledWith(
        {},
        expectedResponse,
        HttpStatus.CONFLICT,
      );
    });
  });
});
