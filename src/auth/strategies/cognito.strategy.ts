import { Inject, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { JwtHeader } from "jsonwebtoken";
import * as jwkToPem from "jwk-to-pem";

import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { UnauthorizedError } from "../../exceptions/http/http.errors";
import { COGNITO_OPTIONS } from "../tokens/auth.tokens";
import { CognitoOptions } from "../interfaces/cognito-options.interface";

interface CognitoJwtPayload extends jwt.JwtPayload {
    sub: string;
    email?: string;
    iss: string;
}

interface JWK {
    kid: string;
    kty: string;
    alg: string;
    use: string;
    n: string;
    e: string;
}

interface JwksCacheEntry {
    keys: JWK[];
    expiresAt: number;
}

@Injectable()
export class CognitoStrategy implements AuthStrategy {
    name = "cognito";

    private readonly jwksCache = new Map<string, JwksCacheEntry>();
    private readonly fetchLocks = new Map<string, Promise<JWK[]>>();
    private readonly ttl: number;

    constructor(
        @Inject(COGNITO_OPTIONS)
        private readonly options: CognitoOptions
    ) {
        this.ttl = options.jwksCacheTtlMs ?? 10 * 60 * 1000; // 10 min default
    }

    canHandle(context: AuthContext): boolean {
        const authHeader = context.headers?.authorization;
        return typeof authHeader === "string" && authHeader.startsWith("Bearer ");
    }

    async validate(context: AuthContext): Promise<AuthResult> {
        const token = this.extractToken(context);

        const decoded = jwt.decode(token, { complete: true }) as
            | { header: JwtHeader; payload: CognitoJwtPayload }
            | null;

        if (!decoded || !decoded.header || !decoded.payload) {
            throw new UnauthorizedError("Invalid JWT format");
        }

        const { header, payload } = decoded;

        if (!header.kid) {
            throw new UnauthorizedError("Invalid JWT header");
        }

        if (!payload.iss?.includes("cognito-idp")) {
            throw new UnauthorizedError("Not a Cognito token");
        }

        const issuer = payload.iss;
        const [region, userPoolId] = this.parseIssuer(issuer);

        this.ensureAllowedUserPool(userPoolId);

        let jwks = await this.getJwks(region, userPoolId);

        let jwk = jwks.find((k) => k.kid === header.kid);

        //  Si no existe el kid fuerza refresh (rotacion de claves)
        if (!jwk) {
            this.jwksCache.delete(userPoolId);
            jwks = await this.getJwks(region, userPoolId);
            jwk = jwks.find((k) => k.kid === header.kid);

            if (!jwk) {
                throw new UnauthorizedError("JWK not found");
            }
        }

        const pem = jwkToPem(jwk as any);

        // try {
        //     jwt.verify(token, pem, {
        //         algorithms: ["RS256"],
        //         issuer,
        //     });
        // } catch (err: any) {
        //     throw new UnauthorizedError(
        //         err?.message || "Invalid or expired token"
        //     );
        // }

        try {
            jwt.verify(token, pem, {
                algorithms: [jwk.alg],
                ignoreExpiration: true, //igual que antes
            });
        } catch (error: any) {
            throw new UnauthorizedError(
                error?.message || "Invalid or expired token"
            );
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

    private extractToken(context: AuthContext): string {
        const authHeader = context.headers?.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedError("Invalid authorization header format");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError("Token missing");
        }

        return token;
    }

    private parseIssuer(issuer: string): [string, string] {
        const match = issuer.match(
            /^https:\/\/cognito-idp\.([^.]+)\.amazonaws\.com\/(.+)$/
        );

        if (!match) {
            throw new UnauthorizedError("Invalid Cognito issuer");
        }

        return [match[1], match[2]];
    }

    private ensureAllowedUserPool(userPoolId: string) {
        if (
            !this.options.allowedUserPoolIds ||
            !this.options.allowedUserPoolIds.includes(userPoolId)
        ) {
            throw new UnauthorizedError("Invalid Cognito user pool");
        }
    }

    private async getJwks(region: string, userPoolId: string): Promise<JWK[]> {
        const cached = this.jwksCache.get(userPoolId);

        if (cached && cached.expiresAt > Date.now()) {
            return cached.keys;
        }

        //  Lock para evitar múltiples fetch simultaneos
        if (this.fetchLocks.has(userPoolId)) {
            return this.fetchLocks.get(userPoolId)!;
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
        } finally {
            this.fetchLocks.delete(userPoolId);
        }
    }

    private async fetchJwks(region: string, userPoolId: string): Promise<JWK[]> {
        const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

        let response: Response;

        try {
            response = await fetch(url);
        } catch {
            throw new UnauthorizedError("Failed to fetch Cognito keys");
        }

        if (!response.ok) {
            throw new UnauthorizedError("Failed to fetch Cognito keys");
        }

        const body = await response.json();

        if (!body?.keys || !Array.isArray(body.keys)) {
            throw new UnauthorizedError("Invalid JWKS response");
        }

        return body.keys;
    }
}
