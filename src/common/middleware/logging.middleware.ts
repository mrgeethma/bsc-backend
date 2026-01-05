import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      const contentLength = res.get('Content-Length') || '0';

      const logLevel = statusCode >= 400 ? 'error' : 'log';
      
      this.logger[logLevel](
        `${method} ${originalUrl} ${statusCode} ${contentLength}b - ${responseTime}ms - ${ip} ${userAgent}`
      );
    });

    next();
  }
}
