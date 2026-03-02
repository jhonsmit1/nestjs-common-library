"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorizationHeader = exports.getRequestId = exports.getRequestContext = exports.requestContext = void 0;
const async_hooks_1 = require("async_hooks");
exports.requestContext = new async_hooks_1.AsyncLocalStorage();
const getRequestContext = () => {
    return exports.requestContext.getStore();
};
exports.getRequestContext = getRequestContext;
const getRequestId = () => {
    return exports.requestContext.getStore()?.requestId;
};
exports.getRequestId = getRequestId;
const getAuthorizationHeader = () => {
    return exports.requestContext.getStore()?.authorization;
};
exports.getAuthorizationHeader = getAuthorizationHeader;
//# sourceMappingURL=request-context.js.map