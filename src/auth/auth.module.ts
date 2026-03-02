import { DynamicModule, Module, Provider } from "@nestjs/common";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./guards/auth.guard";
import { AUTH_STRATEGIES } from "./tokens/auth.tokens";
import { AuthStrategy } from "./interfaces/auth-strategy.interface";

@Module({})
export class AuthModule {
  static register(strategies: Provider<AuthStrategy[]>): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        AuthenticationService,
        AuthGuard,
        strategies,
      ],
      exports: [AuthGuard],
    };
  }
}
