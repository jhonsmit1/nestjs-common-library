import { DynamicModule, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./guards/auth.guard";
import { AUTH_STRATEGIES, API_KEY_OPTIONS, COGNITO_OPTIONS } from "./tokens/auth.tokens";
import { ApiKeyStrategy } from "./strategies/api-key.strategy";
import { CognitoStrategy } from "./strategies/cognito.strategy";
import { ApiKeyOptions } from "./interfaces/api-key-options.interface";
import { CognitoOptions } from "./interfaces/cognito-options.interface";

@Module({})
export class AuthModule {
    static registerAsync(options: {
        useFactory: (...args: any[]) => {
            apiKey?: ApiKeyOptions;
            cognito?: CognitoOptions;
        };
        inject?: any[];
    }): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                {
                    provide: API_KEY_OPTIONS,
                    useFactory: async (...args: any[]) => {
                        const config = await options.useFactory(...args);
                        return config.apiKey ?? { validKeys: [] };
                    },
                    inject: options.inject || [],
                },
                {
                    provide: COGNITO_OPTIONS,
                    useFactory: async (...args: any[]) => {
                        const config = await options.useFactory(...args);
                        return config.cognito ?? { allowedUserPoolIds: [] };
                    },
                    inject: options.inject || [],
                },
                ApiKeyStrategy,
                CognitoStrategy,
                {
                    provide: AUTH_STRATEGIES,
                    useFactory: (
                        apiKeyStrategy: ApiKeyStrategy,
                        cognitoStrategy: CognitoStrategy
                    ) => [apiKeyStrategy, cognitoStrategy],
                    inject: [ApiKeyStrategy, CognitoStrategy],
                },
                AuthenticationService,
                {
                    provide: APP_GUARD,
                    useClass: AuthGuard,
                },
            ],
            exports: [AuthenticationService],
        };
    }
}
