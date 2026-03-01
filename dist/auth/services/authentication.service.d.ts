import { AuthStrategy } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
export declare class AuthenticationService {
    private readonly strategies;
    constructor(strategies: AuthStrategy[]);
    authenticate(context: AuthContext): Promise<import("../interfaces/auth-strategy.interface").AuthResult>;
}
