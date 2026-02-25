import { Inject, Injectable } from "@nestjs/common";
import { LOGGER_ADAPTER, LOGGER_OPTIONS } from "./logger.tokens";
import { ILoggerAdapter } from "./interfaces/logger-adapter.interface";
import { LoggerModuleOptions } from "./interfaces/logger-options.interface";
import { LogLevel } from "./interfaces/log-level.type";
import { getRequestId } from "../context/request-context";

@Injectable()
export class LoggerService {
  constructor(
    @Inject(LOGGER_ADAPTER)
    private readonly logger: ILoggerAdapter,

    @Inject(LOGGER_OPTIONS)
    private readonly options: LoggerModuleOptions
  ) {}

  /**
   * Enrich metadata with:
   * - service info
   * - environment
   * - timestamp
   * - requestId (if exists)
   */
  private enrichMeta(meta?: any) {
    const requestId = getRequestId();

    return {
      service: this.options.serviceName,
      environment: this.options.environment,
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
      ...(meta || {}),
    };
  }

  log(level: LogLevel, message: string, meta?: any) {
    this.logger.log(level, message, this.enrichMeta(meta));
  }

  info(message: string, meta?: any) {
    this.logger.info(message, this.enrichMeta(meta));
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, this.enrichMeta(meta));
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, this.enrichMeta(meta));
  }

  verbose(message: string, meta?: any) {
    this.logger.verbose(message, this.enrichMeta(meta));
  }

  error(message: string, trace?: string | Error, meta?: any) {
    this.logger.error(
      message,
      trace,
      this.enrichMeta(meta)
    );
  }
}
