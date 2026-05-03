import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong on our end. Please try again shortly.';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        // NestJS validation errors come as an array
        if (Array.isArray(resObj['message'])) {
          message = (resObj['message'] as string[]).join('. ');
        } else {
          message = (resObj['message'] as string) ?? message;
        }
        error = (resObj['error'] as string) ?? error;
      }
    } else if (exception instanceof Error) {
      // Map known plain Error messages to friendly ones
      message = this.friendlyMessage(exception.message);
      this.logger.error(`Unhandled Error: ${exception.message}`, exception.stack);
    }

    this.logger.warn(`[${request.method}] ${request.url} → ${status}: ${message}`);

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private friendlyMessage(raw: string): string {
    const map: Record<string, string> = {
      'User not found': 'No account found with these credentials. Please check your email.',
      'Invalid credentials': 'Incorrect password. Please try again.',
      'User registration failed': 'We could not create your account. Please try again.',
      'Email is already in use': 'This email is already registered. Try logging in instead.',
    };
    return map[raw] ?? 'An unexpected error occurred. Our team has been notified.';
  }
}