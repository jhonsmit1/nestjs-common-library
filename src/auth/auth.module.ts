import { DynamicModule, Module, Provider } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./guards/auth.guard";
import { AUTH_STRATEGIES, API_KEY_OPTIONS } from "./tokens/auth.tokens";
import { ApiKeyStrategy } from "./strategies/api-key.strategy";
import { ApiKeyOptions } from "./interfaces/api-key-options.interface";

@Module({})
export class AuthModule {
    static registerAsync(options: {
        useFactory: (...args: any[]) => ApiKeyOptions;
        inject?: any[];
    }): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                {
                    provide: API_KEY_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                ApiKeyStrategy,
                {
                    provide: AUTH_STRATEGIES,
                    useFactory: (apiKeyStrategy: ApiKeyStrategy) => [apiKeyStrategy],
                    inject: [ApiKeyStrategy],
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
