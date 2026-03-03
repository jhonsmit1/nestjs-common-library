import { ILoggerAdapter } from "../interfaces/logger-adapter.interface";
import { LoggerModuleOptions } from "../interfaces/logger-options.interface";
export declare class WinstonLoggerAdapter implements ILoggerAdapter {
    private readonly options;
    private logger;
    constructor(options: LoggerModuleOptions);
    private createLogger;
    log(level: string, message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    error(message: string, trace?: any, meta?: any): void;
    warn(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    verbose(message: string, meta?: any): void;
}
