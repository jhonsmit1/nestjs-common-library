"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServiceStrategy = void 0;
const http_errors_1 = require("../../exceptions/http/http.errors");
class InternalServiceStrategy {
    internalSecret;
    name = "internal-service";
    constructor(internalSecret) {
        this.internalSecret = internalSecret;
    }
    canHandle(context) {
        return !!context.headers["x-internal-secret"];
    }
    async validate(context) {
        const secret = context.headers["x-internal-secret"];
        if (secret !== this.internalSecret) {
            throw new http_errors_1.UnauthorizedError("Invalid internal service secret");
        }
        return {
            service: "internal-service"
        };
    }
}
exports.InternalServiceStrategy = InternalServiceStrategy;
//# sourceMappingURL=internal-service.strategy.js.map