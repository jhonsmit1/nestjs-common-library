import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthenticationService } from "../services/authentication.service";
export declare class AuthGuard implements CanActivate {
    private readonly authService;
    private readonly reflector;
    constructor(authService: AuthenticationService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
