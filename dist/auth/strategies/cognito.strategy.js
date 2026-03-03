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
exports.CognitoStrategy = void 0;
const common_1 = require("@nestjs/common");
const http_errors_1 = require("../../exceptions/http/http.errors");
const auth_tokens_1 = require("../tokens/auth.tokens");
const jsonwebtoken_1 = require("jsonwebtoken");
const jwk_to_pem_1 = require("jwk-to-pem");
const jwksCache = new Map();
let CognitoStrategy = class CognitoStrategy {
    options;
    name = "cognito";
    constructor(options) {
        this.options = options;
    }
    canHandle(context) {
        const authHeader = context.headers?.authorization;
        return typeof authHeader === "string" && authHeader.startsWith("Bearer ");
    }
    async validate(context) {
        const authHeader = context.headers.authorization;
        if (!authHeader) {
            throw new http_errors_1.UnauthorizedError("Missing Authorization header");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new http_errors_1.UnauthorizedError("Invalid Bearer token format");
        }
        const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
        if (!decoded) {
            throw new http_errors_1.UnauthorizedError("Invalid JWT format");
        }
        const { header, payload } = decoded;
        if (!payload?.iss?.includes("cognito-idp")) {
            throw new http_errors_1.UnauthorizedError("Not a Cognito token");
        }
        const issuer = payload.iss;
        const [region, userPoolId] = this.parseRegionAndUserPoolId(issuer);
        if (!this.options.allowedUserPoolIds.includes(userPoolId)) {
            throw new http_errors_1.UnauthorizedError("Invalid Cognito user pool");
        }
        const jwks = await this.getJwks(region, userPoolId);
        const jwk = jwks.find((k) => k.kid === header.kid);
        if (!jwk) {
            throw new http_errors_1.UnauthorizedError("JWK not found");
        }
        const pem = (0, jwk_to_pem_1.default)(jwk);
        try {
            jsonwebtoken_1.default.verify(token, pem, {
                algorithms: ["RS256"],
            });
        }
        catch {
            throw new http_errors_1.UnauthorizedError("Invalid or expired token");
        }
        return {
            userId: payload.sub,
            roles: ["user"],
            metadata: {
                email: payload.email,
                issuer,
                authType: "cognito",
            },
        };
    }
    parseRegionAndUserPoolId(issuer) {
        const regionMatch = issuer.match(/cognito-idp\.([^.]+)\.amazonaws\.com/);
        if (!regionMatch) {
            throw new http_errors_1.UnauthorizedError("Invalid Cognito issuer");
        }
        const region = regionMatch[1];
        const userPoolId = issuer.split("/").pop();
        return [region, userPoolId];
    }
    async getJwks(region, userPoolId) {
        if (jwksCache.has(userPoolId)) {
            return jwksCache.get(userPoolId);
        }
        const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new http_errors_1.UnauthorizedError("Failed to fetch Cognito keys");
        }
        const body = await response.json();
        jwksCache.set(userPoolId, body.keys);
        return body.keys;
    }
};
exports.CognitoStrategy = CognitoStrategy;
exports.CognitoStrategy = CognitoStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(auth_tokens_1.COGNITO_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], CognitoStrategy);
//# sourceMappingURL=cognito.strategy.js.map