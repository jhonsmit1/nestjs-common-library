export interface CognitoOptions {
    allowedUserPoolIds: string[];
    jwksCacheTtlMs?: number; // default 10 minutos
}
