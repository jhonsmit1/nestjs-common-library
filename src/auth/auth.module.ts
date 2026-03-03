import { DynamicModule, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./guards/auth.guard";

import {
    AUTH_STRATEGIES,
    API_KEY_OPTIONS,
    COGNITO_OPTIONS,
} from "./tokens/auth.tokens";

import { ApiKeyStrategy } from "./strategies/api-key.strategy";
import { CognitoStrategy } from "./strategies/cognito.strategy";

import { ApiKeyOptions } from "./interfaces/api-key-options.interface";
import { CognitoOptions } from "./interfaces/cognito-options.interface";

@Module({})
export class AuthModule {
    static registerAsync(options: {
        useFactory: (...args: any[]) => Promise<{
            apiKey?: ApiKeyOptions;
            cognito?: CognitoOptions;
        }> | {
            apiKey?: ApiKeyOptions;
            cognito?: CognitoOptions;
        };
        inject?: any[];
    }): DynamicModule {

        const asyncOptionsProvider: Provider = {
            provide: "AUTH_MODULE_OPTIONS",
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        const providers: Provider[] = [
            asyncOptionsProvider,
            AuthenticationService,
            {
                provide: APP_GUARD,
                useClass: AuthGuard,
            },
        ];

        const strategyProviders: Provider[] = [];

        // API KEY
        strategyProviders.push({
            provide: API_KEY_OPTIONS,
            useFactory: async (opts: any) => opts.apiKey,
            inject: ["AUTH_MODULE_OPTIONS"],
        });

        strategyProviders.push({
            provide: ApiKeyStrategy,
            useFactory: async (opts: any) => {
                if (!opts.apiKey) return null;
                return new ApiKeyStrategy(opts.apiKey);
            },
            inject: ["AUTH_MODULE_OPTIONS"],
        });

        // COGNITO
        strategyProviders.push({
            provide: COGNITO_OPTIONS,
            useFactory: async (opts: any) => opts.cognito,
            inject: ["AUTH_MODULE_OPTIONS"],
        });

        strategyProviders.push({
            provide: CognitoStrategy,
            useFactory: async (opts: any) => {
                if (!opts.cognito) return null;
                return new CognitoStrategy(opts.cognito);
            },
            inject: ["AUTH_MODULE_OPTIONS"],
        });

        // AUTH STRATEGIES ARRAY
        strategyProviders.push({
            provide: AUTH_STRATEGIES,
            useFactory: (
                apiKeyStrategy: ApiKeyStrategy | null,
                cognitoStrategy: CognitoStrategy | null
            ) => {
                return [apiKeyStrategy, cognitoStrategy].filter(Boolean);
            },
            inject: [ApiKeyStrategy, CognitoStrategy],
        });

        return {
            module: AuthModule,
            providers: [...providers, ...strategyProviders],
            exports: [AuthenticationService],
        };
    }
}
