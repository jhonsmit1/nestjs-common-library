import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
export declare class ApiKeyStrategy implements AuthStrategy {
    private readonly validKeys;
    name: string;
    constructor(validKeys: string[]);
    canHandle(context: AuthContext): boolean;
    validate(context: AuthContext): Promise<AuthResult>;
}
