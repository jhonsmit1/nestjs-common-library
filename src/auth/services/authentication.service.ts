import { Inject, Injectable } from "@nestjs/common";
import { AUTH_STRATEGIES } from "../tokens/auth.tokens";
import { AuthStrategy } from "../interfaces/auth-strategy.interface";
import { AuthContext } from "../interfaces/auth-context.interface";
import { UnauthorizedError } from "src/exceptions/http/http.errors";

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(AUTH_STRATEGIES)
    private readonly strategies: AuthStrategy[]
  ) {}

  async authenticate(context: AuthContext) {
    const strategy = this.strategies.find(s => s.canHandle(context));

    if (!strategy) {
      throw new UnauthorizedError("No valid authentication strategy found");
    }

    return strategy.validate(context);
  }
}
