"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.UnprocessableEntityError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const app_error_1 = require("../base/app.error");
class BadRequestError extends app_error_1.AppError {
    constructor(message = "Bad Request", metadata) {
        super(400, message, "BAD_REQUEST", metadata);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends app_error_1.AppError {
    constructor(message = "Unauthorized", metadata) {
        super(401, message, "UNAUTHORIZED", metadata);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends app_error_1.AppError {
    constructor(message = "Forbidden", metadata) {
        super(403, message, "FORBIDDEN", metadata);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends app_error_1.AppError {
    constructor(message = "Resource Not Found", metadata) {
        super(404, message, "NOT_FOUND", metadata);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends app_error_1.AppError {
    constructor(message = "Conflict", metadata) {
        super(409, message, "CONFLICT", metadata);
    }
}
exports.ConflictError = ConflictError;
class UnprocessableEntityError extends app_error_1.AppError {
    constructor(message = "Unprocessable Entity", metadata) {
        super(422, message, "UNPROCESSABLE_ENTITY", metadata);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class InternalServerError extends app_error_1.AppError {
    constructor(message = "Internal Server Error", metadata) {
        super(500, message, "INTERNAL_SERVER_ERROR", metadata);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=http.errors.js.map