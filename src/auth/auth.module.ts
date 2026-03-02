import { Module } from "@nestjs/common";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./guards/auth.guard";

@Module({
    providers: [AuthenticationService, AuthGuard],
    exports: [AuthenticationService, AuthGuard],
})
export class AuthModule { }
