"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyStrategy = void 0;
const http_errors_1 = require("../../exceptions/http/http.errors");
class ApiKeyStrategy {
    validKeys;
    name = "api-key";
    constructor(validKeys) {
        this.validKeys = validKeys;
    }
    canHandle(context) {
        return !!context.headers["x-api-key"];
    }
    async validate(context) {
        const apiKey = context.headers["x-api-key"];
        if (!this.validKeys.includes(apiKey)) {
            throw new http_errors_1.UnauthorizedError("Invalid API Key");
        }
        return {
            service: "external-client",
            metadata: { apiKey }
        };
    }
}
exports.ApiKeyStrategy = ApiKeyStrategy;
//# sourceMappingURL=api-key.strategy.js.map