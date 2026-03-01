import { AuthStrategy, AuthResult } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { UnauthorizedError } from "src/exceptions/http/http.errors";
import * as jwt from "jsonwebtoken";

export class JwtAuthStrategy implements AuthStrategy {
  name = "jwt";

  constructor(private readonly jwtSecret: string) {}

  canHandle(context: AuthContext): boolean {
    return !!context.headers.authorization?.startsWith("Bearer ");
  }

  async validate(context: AuthContext): Promise<AuthResult> {
    const token = context.headers.authorization.split(" ")[1];

    try {
      const payload = jwt.verify(token, this.jwtSecret) as any;

      return {
        userId: payload.sub,
        roles: payload.roles || [],
        metadata: payload
      };
    } catch {
      throw new UnauthorizedError("Invalid JWT token");
    }
  }
}
