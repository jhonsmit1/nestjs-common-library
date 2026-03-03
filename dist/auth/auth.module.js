"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const authentication_service_1 = require("./services/authentication.service");
const auth_guard_1 = require("./guards/auth.guard");
const auth_tokens_1 = require("./tokens/auth.tokens");
const api_key_strategy_1 = require("./strategies/api-key.strategy");
const cognito_strategy_1 = require("./strategies/cognito.strategy");
let AuthModule = AuthModule_1 = class AuthModule {
    static registerAsync(options) {
        return {
            module: AuthModule_1,
            providers: [
                {
                    provide: auth_tokens_1.API_KEY_OPTIONS,
                    useFactory: async (...args) => {
                        const config = await options.useFactory(...args);
                        return config.apiKey ?? { validKeys: [] };
                    },
                    inject: options.inject || [],
                },
                {
                    provide: auth_tokens_1.COGNITO_OPTIONS,
                    useFactory: async (...args) => {
                        const config = await options.useFactory(...args);
                        return config.cognito ?? { allowedUserPoolIds: [] };
                    },
                    inject: options.inject || [],
                },
                api_key_strategy_1.ApiKeyStrategy,
                cognito_strategy_1.CognitoStrategy,
                {
                    provide: auth_tokens_1.AUTH_STRATEGIES,
                    useFactory: (apiKeyStrategy, cognitoStrategy) => [apiKeyStrategy, cognitoStrategy],
                    inject: [api_key_strategy_1.ApiKeyStrategy, cognito_strategy_1.CognitoStrategy],
                },
                authentication_service_1.AuthenticationService,
                {
                    provide: core_1.APP_GUARD,
                    useClass: auth_guard_1.AuthGuard,
                },
            ],
            exports: [authentication_service_1.AuthenticationService],
        };
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = AuthModule_1 = __decorate([
    (0, common_1.Module)({})
], AuthModule);
//# sourceMappingURL=auth.module.js.map