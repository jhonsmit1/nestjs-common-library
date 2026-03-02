import { DynamicModule, Module, Provider } from "@nestjs/common";
import { AuthenticationService } from "./services/authentication.service";
import { AuthGuard } from "./guards/auth.guard";
import { AuthStrategy } from "./interfaces/auth-strategy.interface";

@Module({})
export class AuthModule {
    static register(strategiesProvider: Provider<AuthStrategy[]>): DynamicModule {
        return {
            module: AuthModule,
            providers: [
                strategiesProvider,
                AuthenticationService,
                AuthGuard,
            ],
            exports: [
                AuthenticationService,
                AuthGuard,
            ],
        };
    }
}
