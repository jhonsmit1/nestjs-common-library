import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
export declare class JwtAuthStrategy implements AuthStrategy {
    private readonly jwtSecret;
    name: string;
    constructor(jwtSecret: string);
    canHandle(context: AuthContext): boolean;
    validate(context: AuthContext): Promise<AuthResult>;
}
