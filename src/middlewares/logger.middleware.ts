import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../config/custom-logger/custom-logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly LOGGER: CustomLoggerService) {}

  use(request: Request, response: Response, next: NextFunction) {
    const { method } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      this.LOGGER.log(
        `[${method}] request to ${request.originalUrl} - [${statusCode}]`,
      );
    });
    next();
  }
}
