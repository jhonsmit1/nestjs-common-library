import { AsyncLocalStorage } from "async_hooks";

export interface RequestContextStore {
  requestId: string;
  authorization?: string;
  user?: unknown;
}

export const requestContext = new AsyncLocalStorage<RequestContextStore>();

export const getRequestContext = (): RequestContextStore | undefined => {
  return requestContext.getStore();
};

export const getRequestId = (): string | undefined => {
  return requestContext.getStore()?.requestId;
};

export const getAuthorizationHeader = (): string | undefined => {
  return requestContext.getStore()?.authorization;
};
