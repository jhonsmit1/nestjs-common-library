import { Module, Global } from "@nestjs/common";
import { AuthGuard } from "./guards/auth.guard";
import { ApiKeyStrategy } from "./strategies/api-key.strategy";

@Global()
@Module({
    providers: [

        ApiKeyStrategy,

        {
            provide: "AUTH_STRATEGIES",
            useFactory: (
                api: ApiKeyStrategy,
            ) => [api],
            inject: [ApiKeyStrategy],
        },
        {
            provide: AuthGuard,
            useFactory: (
                reflector,
                strategies,
            ) => new AuthGuard(reflector, strategies),
            inject: ["Reflector", "AUTH_STRATEGIES"],
        },
    ],
    exports: [AuthGuard,],
})
export class AuthModule { }
