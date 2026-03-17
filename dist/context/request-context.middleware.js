"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestContextMiddleware = requestContextMiddleware;
const uuid_1 = require("uuid");
const request_context_1 = require("./request-context");
function requestContextMiddleware(req, res, next) {
    const requestId = (0, uuid_1.v4)();
    res.setHeader("X-Request-ID", requestId);
    const authorization = req.headers["authorization"];
    request_context_1.requestContext.run({
        requestId,
        authorization,
    }, () => next());
}
//# sourceMappingURL=request-context.middleware.js.map