"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthStrategy = void 0;
const http_errors_1 = require("src/exceptions/http/http.errors");
const jwt = require("jsonwebtoken");
class JwtAuthStrategy {
    jwtSecret;
    name = "jwt";
    constructor(jwtSecret) {
        this.jwtSecret = jwtSecret;
    }
    canHandle(context) {
        return !!context.headers.authorization?.startsWith("Bearer ");
    }
    async validate(context) {
        const token = context.headers.authorization.split(" ")[1];
        try {
            const payload = jwt.verify(token, this.jwtSecret);
            return {
                userId: payload.sub,
                roles: payload.roles || [],
                metadata: payload
            };
        }
        catch {
            throw new http_errors_1.UnauthorizedError("Invalid JWT token");
        }
    }
}
exports.JwtAuthStrategy = JwtAuthStrategy;
//# sourceMappingURL=jwt.strategy.js.map