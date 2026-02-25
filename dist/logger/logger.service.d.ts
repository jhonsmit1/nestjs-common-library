import { ILoggerAdapter } from "./interfaces/logger-adapter.interface";
import { LoggerModuleOptions } from "./interfaces/logger-options.interface";
import { LogLevel } from "./interfaces/log-level.type";
export declare class LoggerService {
    private readonly logger;
    private readonly options;
    constructor(logger: ILoggerAdapter, options: LoggerModuleOptions);
    private enrichMeta;
    log(level: LogLevel, message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    verbose(message: string, meta?: any): void;
    error(message: string, trace?: any, meta?: any): void;
}
