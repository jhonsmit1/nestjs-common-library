"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("./guards/auth.guard");
const api_key_strategy_1 = require("./strategies/api-key.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            api_key_strategy_1.ApiKeyStrategy,
            {
                provide: "AUTH_STRATEGIES",
                useFactory: (api) => [api],
                inject: [api_key_strategy_1.ApiKeyStrategy],
            },
            {
                provide: auth_guard_1.AuthGuard,
                useFactory: (reflector, strategies) => new auth_guard_1.AuthGuard(reflector, strategies),
                inject: ["Reflector", "AUTH_STRATEGIES"],
            },
        ],
        exports: [auth_guard_1.AuthGuard,],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map