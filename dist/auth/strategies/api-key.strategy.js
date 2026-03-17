"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyStrategy = void 0;
const common_1 = require("@nestjs/common");
const http_errors_1 = require("../../exceptions/http/http.errors");
const auth_tokens_1 = require("../tokens/auth.tokens");
let ApiKeyStrategy = class ApiKeyStrategy {
    options;
    name = "api-key";
    constructor(options) {
        this.options = options;
    }
    canHandle(context) {
        return !!context.headers["x-api-key"];
    }
    async validate(context) {
        const apiKey = context.headers["x-api-key"];
        if (!this.options.validKeys.includes(apiKey)) {
            throw new http_errors_1.UnauthorizedError("Invalid API Key");
        }
        return {
            service: "external-client",
            metadata: { authType: "api-key" },
        };
    }
};
exports.ApiKeyStrategy = ApiKeyStrategy;
exports.ApiKeyStrategy = ApiKeyStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_tokens_1.API_KEY_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], ApiKeyStrategy);
//# sourceMappingURL=api-key.strategy.js.map