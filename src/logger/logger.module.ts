import {
    DynamicModule,
    Global,
    Module,
    Provider,
} from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LOGGER_OPTIONS, LOGGER_ADAPTER } from "./logger.tokens";
import { WinstonLoggerAdapter } from "./adapters/winston-logger.adapter";
import { LoggerModuleOptions } from "./interfaces/logger-options.interface";

@Global()
@Module({})
export class LoggerModule {
    static forRoot(options: LoggerModuleOptions): DynamicModule {
        return {
            module: LoggerModule,
            providers: [
                {
                    provide: LOGGER_OPTIONS,
                    useValue: options,
                },
                {
                    provide: LOGGER_ADAPTER,
                    useClass: WinstonLoggerAdapter,
                },
                LoggerService,
            ],
            exports: [LoggerService],
        };
    }

    static forRootAsync(options: {
        useFactory: (...args: any[]) => LoggerModuleOptions;
        inject?: any[];
    }): DynamicModule {
        const asyncOptionsProvider: Provider = {
            provide: LOGGER_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        return {
            module: LoggerModule,
            providers: [
                asyncOptionsProvider,
                {
                    provide: LOGGER_ADAPTER,
                    useClass: WinstonLoggerAdapter,
                },
                LoggerService,
            ],
            exports: [LoggerService],
        };
    }
}
