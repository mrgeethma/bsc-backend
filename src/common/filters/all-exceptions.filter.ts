import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../utils/response.util';

interface ValidationErrorItem {
  field?: string;
  messages: string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: ValidationErrorItem[] | undefined;

    // If it's an HttpException (BadRequestException, NotFoundException, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;

        // Handle validation errors from class-validator
        if (Array.isArray(responseObj.message)) {
          errors = responseObj.message.map((msg: string) => ({
            messages: [msg],
          }));
          message = 'Validation failed';
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error for debugging
    this.logger.error(
      `${request.method} ${request.url} - ${status} ${message}`,
      exception instanceof Error ? exception.stack : exception,
    );

    // Create standardized error response
    const errorResponse: ApiResponse<null> = {
      success: false,
      statusCode: status,
      message,
      data: null,
      ...(errors && { errors }),
    };

    response.status(status).json(errorResponse);
  }
}
