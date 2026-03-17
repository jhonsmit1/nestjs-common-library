import { DynamicModule } from "@nestjs/common";
import { LoggerModuleOptions } from "./interfaces/logger-options.interface";
export declare class LoggerModule {
    static forRoot(options: LoggerModuleOptions): DynamicModule;
    static forRootAsync(options: {
        useFactory: (...args: any[]) => LoggerModuleOptions;
        inject?: any[];
    }): DynamicModule;
}
