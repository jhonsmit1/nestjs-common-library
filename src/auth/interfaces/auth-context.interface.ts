export interface AuthContext {
  headers: Record<string, any>;
  requestId?: string;
  ip?: string;
}
