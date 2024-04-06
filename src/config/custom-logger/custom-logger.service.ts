import { Injectable, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private LOGGER_LOG = new Logger('LOG');
  private LOGGER_INFO = new Logger('INFO');
  private LOGGER_ERROR = new Logger('ERROR');
  private LOGGER_WARN = new Logger('WARN');
  private LOGGER_DEBUG = new Logger('DEBUG');

  log(message: string) {
    this.LOGGER_LOG.log(message);
  }

  info(message: string) {
    this.LOGGER_INFO.log(message, this.log);
  }

  error(message: string, trace: string) {
    this.LOGGER_ERROR.error(message, trace);
  }

  warn(message: string) {
    this.LOGGER_WARN.warn(message);
  }

  debug(message: string) {
    this.LOGGER_DEBUG.debug(message);
  }

  verbose(message: string) {
    this.LOGGER_INFO.verbose(message);
  }
}
