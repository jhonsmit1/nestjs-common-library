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
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const http_errors_1 = require("../../exceptions/http/http.errors");
const auth_tokens_1 = require("../tokens/auth.tokens");
let CognitoStrategy = class CognitoStrategy {
    options;
    name = "cognito";
    jwksCache = new Map();
    fetchLocks = new Map();
    ttl;
    constructor(options) {
        this.options = options;
        this.ttl = options.jwksCacheTtlMs ?? 10 * 60 * 1000;
    }
    canHandle(context) {
        const authHeader = context.headers?.authorization;
        return typeof authHeader === "string" && authHeader.startsWith("Bearer ");
    }
    async validate(context) {
        const token = this.extractToken(context);
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded || !decoded.header || !decoded.payload) {
            throw new http_errors_1.UnauthorizedError("Invalid JWT format");
        }
        const { header, payload } = decoded;
        if (!header.kid) {
            throw new http_errors_1.UnauthorizedError("Invalid JWT header");
        }
        if (!payload.iss?.includes("cognito-idp")) {
            throw new http_errors_1.UnauthorizedError("Not a Cognito token");
        }
        const issuer = payload.iss;
        const [region, userPoolId] = this.parseIssuer(issuer);
        this.ensureAllowedUserPool(userPoolId);
        let jwks = await this.getJwks(region, userPoolId);
        let jwk = jwks.find((k) => k.kid === header.kid);
        if (!jwk) {
            this.jwksCache.delete(userPoolId);
            jwks = await this.getJwks(region, userPoolId);
            jwk = jwks.find((k) => k.kid === header.kid);
            if (!jwk) {
                throw new http_errors_1.UnauthorizedError("JWK not found");
            }
        }
        const pem = jwkToPem(jwk);
        try {
            jwt.verify(token, pem, {
                algorithms: [jwk.alg],
                ignoreExpiration: true,
            });
        }
        catch (error) {
            throw new http_errors_1.UnauthorizedError(error?.message || "Invalid or expired token");
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
    extractToken(context) {
        const authHeader = context.headers?.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw new http_errors_1.UnauthorizedError("Invalid authorization header format");
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new http_errors_1.UnauthorizedError("Token missing");
        }
        return token;
    }
    parseIssuer(issuer) {
        const match = issuer.match(/^https:\/\/cognito-idp\.([^.]+)\.amazonaws\.com\/(.+)$/);
        if (!match) {
            throw new http_errors_1.UnauthorizedError("Invalid Cognito issuer");
        }
        return [match[1], match[2]];
    }
    ensureAllowedUserPool(userPoolId) {
        if (!this.options.allowedUserPoolIds ||
            !this.options.allowedUserPoolIds.includes(userPoolId)) {
            throw new http_errors_1.UnauthorizedError("Invalid Cognito user pool");
        }
    }
    async getJwks(region, userPoolId) {
        const cached = this.jwksCache.get(userPoolId);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.keys;
        }
        if (this.fetchLocks.has(userPoolId)) {
            return this.fetchLocks.get(userPoolId);
        }
        const fetchPromise = this.fetchJwks(region, userPoolId);
        this.fetchLocks.set(userPoolId, fetchPromise);
        try {
            const keys = await fetchPromise;
            this.jwksCache.set(userPoolId, {
                keys,
                expiresAt: Date.now() + this.ttl,
            });
            return keys;
        }
        finally {
            this.fetchLocks.delete(userPoolId);
        }
    }
    async fetchJwks(region, userPoolId) {
        const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
        let response;
        try {
            response = await fetch(url);
        }
        catch {
            throw new http_errors_1.UnauthorizedError("Failed to fetch Cognito keys");
        }
        if (!response.ok) {
            throw new http_errors_1.UnauthorizedError("Failed to fetch Cognito keys");
        }
        const body = await response.json();
        if (!body?.keys || !Array.isArray(body.keys)) {
            throw new http_errors_1.UnauthorizedError("Invalid JWKS response");
        }
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