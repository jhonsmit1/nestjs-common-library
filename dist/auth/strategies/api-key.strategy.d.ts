import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { ApiKeyOptions } from "../interfaces/api-key-options.interface";
export declare class ApiKeyStrategy implements AuthStrategy {
    private readonly options;
    name: string;
    constructor(options: ApiKeyOptions);
    canHandle(context: AuthContext): boolean;
    validate(context: AuthContext): Promise<AuthResult>;
}
