import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { CognitoOptions } from "../interfaces/cognito-options.interface";
export declare class CognitoStrategy implements AuthStrategy {
    private readonly options;
    name: string;
    constructor(options: CognitoOptions);
    canHandle(context: AuthContext): boolean;
    validate(context: AuthContext): Promise<AuthResult>;
    private parseRegionAndUserPoolId;
    private getJwks;
}
