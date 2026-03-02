import { DynamicModule, Provider } from "@nestjs/common";
import { AuthStrategy } from "./interfaces/auth-strategy.interface";
export declare class AuthModule {
    static register(strategiesProvider: Provider<AuthStrategy[]>): DynamicModule;
}
