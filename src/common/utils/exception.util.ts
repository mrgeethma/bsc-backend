import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function handleHttpException(
  error: any,
  logger: Logger,
  fallbackMessage: string,
) {
  if (error instanceof HttpException) {
    throw error;
  }
  logger.error(fallbackMessage, error.stack || error.message);
  throw new InternalServerErrorException(fallbackMessage);
}
