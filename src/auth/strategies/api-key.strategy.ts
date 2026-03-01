import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { UnauthorizedError } from "../../exceptions/http/http.errors";

export class ApiKeyStrategy implements AuthStrategy {
  name = "api-key";

  constructor(private readonly validKeys: string[]) {}

  canHandle(context: AuthContext): boolean {
    return !!context.headers["x-api-key"];
  }

  async validate(context: AuthContext): Promise<AuthResult> {
    const apiKey = context.headers["x-api-key"];

    if (!this.validKeys.includes(apiKey)) {
      throw new UnauthorizedError("Invalid API Key");
    }

    return {
      service: "external-client",
      metadata: { apiKey }
    };
  }
}
