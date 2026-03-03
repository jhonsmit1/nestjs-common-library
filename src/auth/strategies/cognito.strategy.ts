import { Inject, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { JwtHeader } from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

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

const jwksCache = new Map<string, JWK[]>();

@Injectable()
export class CognitoStrategy implements AuthStrategy {
    name = "cognito";

    constructor(
        @Inject(COGNITO_OPTIONS)
        private readonly options: CognitoOptions
    ) { }

    canHandle(context: AuthContext): boolean {
        const authHeader = context.headers?.authorization;

        return (
            typeof authHeader === "string" &&
            authHeader.startsWith("Bearer ")
        );
    }

    async validate(context: AuthContext): Promise<AuthResult> {
        const authHeader = context.headers?.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Invalid authorization header format");
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new UnauthorizedError("Token missing");
        }

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

        if (!payload?.iss || !payload.iss.includes("cognito-idp")) {
            throw new UnauthorizedError("Not a Cognito token");
        }

        const issuer = payload.iss;

        const [region, userPoolId] =
            this.parseRegionAndUserPoolId(issuer);

        if (
            !this.options.allowedUserPoolIds ||
            !this.options.allowedUserPoolIds.includes(userPoolId)
        ) {
            throw new UnauthorizedError("Invalid Cognito user pool");
        }

        const jwks = await this.getJwks(region, userPoolId);

        const jwk = jwks.find((k) => k.kid === header.kid);

        if (!jwk) {
            throw new UnauthorizedError("JWK not found");
        }

        const pem = jwkToPem(jwk as any);

        try {
            jwt.verify(token, pem, {
                algorithms: ["RS256"],
                issuer,
            });
        } catch {
            throw new UnauthorizedError("Invalid or expired token");
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

    private parseRegionAndUserPoolId(
        issuer: string
    ): [string, string] {
        const match = issuer.match(
            /^https:\/\/cognito-idp\.([^.]+)\.amazonaws\.com\/(.+)$/
        );

        if (!match) {
            throw new UnauthorizedError("Invalid Cognito issuer");
        }

        const region = match[1];
        const userPoolId = match[2];

        return [region, userPoolId];
    }

    private async getJwks(
        region: string,
        userPoolId: string
    ): Promise<JWK[]> {
        if (jwksCache.has(userPoolId)) {
            return jwksCache.get(userPoolId)!;
        }

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

        jwksCache.set(userPoolId, body.keys);

        return body.keys;
    }
}
