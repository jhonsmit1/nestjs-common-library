import { AsyncLocalStorage } from "async_hooks";
export interface RequestContextStore {
    requestId: string;
    authorization?: string;
    user?: unknown;
}
export declare const requestContext: AsyncLocalStorage<RequestContextStore>;
export declare const getRequestContext: () => RequestContextStore | undefined;
export declare const getRequestId: () => string | undefined;
export declare const getAuthorizationHeader: () => string | undefined;
