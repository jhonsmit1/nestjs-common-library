import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { CognitoOptions } from "../interfaces/cognito-options.interface";
export declare class CognitoStrategy implements AuthStrategy {
    private readonly options;
    name: string;
    private readonly jwksCache;
    private readonly fetchLocks;
    private readonly ttl;
    constructor(options: CognitoOptions);
    canHandle(context: AuthContext): boolean;
    validate(context: AuthContext): Promise<AuthResult>;
    private extractToken;
    private parseIssuer;
    private ensureAllowedUserPool;
    private getJwks;
    private fetchJwks;
}
