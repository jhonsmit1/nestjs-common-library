import { AuthContext } from "./auth-context.interface";

export interface AuthResult {
  userId?: string;
  roles?: string[];
  service?: string;
  metadata?: Record<string, any>;
}

export interface AuthStrategy {
  name: string;
  canHandle(context: AuthContext): boolean;
  validate(context: AuthContext): Promise<AuthResult>;
}
