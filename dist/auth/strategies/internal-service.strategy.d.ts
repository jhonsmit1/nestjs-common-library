import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
export declare class InternalServiceStrategy implements AuthStrategy {
    private readonly internalSecret;
    name: string;
    constructor(internalSecret: string);
    canHandle(context: AuthContext): boolean;
    validate(context: AuthContext): Promise<AuthResult>;
}
