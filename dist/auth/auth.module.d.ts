import { DynamicModule } from "@nestjs/common";
import { ApiKeyOptions } from "./interfaces/api-key-options.interface";
export declare class AuthModule {
    static registerAsync(options: {
        useFactory: (...args: any[]) => ApiKeyOptions;
        inject?: any[];
    }): DynamicModule;
}
