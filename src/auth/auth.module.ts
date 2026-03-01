import { Module, DynamicModule } from "@nestjs/common";
import { AUTH_STRATEGIES } from "./tokens/auth.tokens";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./guards/auth.guard";
import { AuthStrategy } from "./interfaces/auth-strategy.interface";

@Module({})
export class AuthModule {
  static register(strategies: AuthStrategy[]): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        AuthenticationService,
        AuthGuard,
        {
          provide: AUTH_STRATEGIES,
          useValue: strategies
        }
      ],
      exports: [AuthenticationService, AuthGuard]
    };
  }
}
