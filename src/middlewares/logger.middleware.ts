// logger.middleware.ts

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `[${method}] request to ${req.originalUrl} - [${statusCode}]`,
      );
    });
    next();
  }
}