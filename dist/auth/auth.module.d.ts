import { DynamicModule } from "@nestjs/common";
import { AuthStrategy } from "./interfaces/auth-strategy.interface";
export declare class AuthModule {
    static register(strategies: AuthStrategy[]): DynamicModule;
}
