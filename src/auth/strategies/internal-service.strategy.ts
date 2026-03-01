import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { UnauthorizedError } from "../../exceptions/http/http.errors";

export class InternalServiceStrategy implements AuthStrategy {
  name = "internal-service";

  constructor(private readonly internalSecret: string) {}

  canHandle(context: AuthContext): boolean {
    return !!context.headers["x-internal-secret"];
  }

  async validate(context: AuthContext): Promise<AuthResult> {
    const secret = context.headers["x-internal-secret"];

    if (secret !== this.internalSecret) {
      throw new UnauthorizedError("Invalid internal service secret");
    }

    return {
      service: "internal-service"
    };
  }
}
