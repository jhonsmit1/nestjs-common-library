import { DynamicModule } from "@nestjs/common";
import { ApiKeyOptions } from "./interfaces/api-key-options.interface";
import { CognitoOptions } from "./interfaces/cognito-options.interface";
export declare class AuthModule {
    static registerAsync(options: {
        useFactory: (...args: any[]) => Promise<{
            apiKey?: ApiKeyOptions;
            cognito?: CognitoOptions;
        }> | {
            apiKey?: ApiKeyOptions;
            cognito?: CognitoOptions;
        };
        inject?: any[];
    }): DynamicModule;
}
