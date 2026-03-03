import { Inject, Injectable } from "@nestjs/common";
import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { UnauthorizedError } from "../../exceptions/http/http.errors";
import { API_KEY_OPTIONS } from "../tokens/auth.tokens";
import { ApiKeyOptions } from "../interfaces/api-key-options.interface";

@Injectable()
export class ApiKeyStrategy implements AuthStrategy {
  name = "api-key";

  constructor(
    @Inject(API_KEY_OPTIONS)
    private readonly options: ApiKeyOptions
  ) { }

  canHandle(context: AuthContext): boolean {
    return !!context.headers["x-api-key"];
  }

  async validate(context: AuthContext): Promise<AuthResult> {
    const apiKey = context.headers["x-api-key"];

    if (!this.options.validKeys.includes(apiKey)) {
      throw new UnauthorizedError("Invalid API Key");
    }

    return {
      service: "external-client",
      metadata: { authType: "api-key" },
    };
  }
}
