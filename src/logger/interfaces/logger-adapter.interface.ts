import { LogLevel } from "./log-level.type";

export interface ILoggerAdapter {
  log(level: LogLevel, message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  error(message: string, trace?: string | Error, meta?: any): void;
  warn(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  verbose(message: string, meta?: any): void;
}
