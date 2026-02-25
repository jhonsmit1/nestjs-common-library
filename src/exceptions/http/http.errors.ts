import { AppError } from "../base/app.error";

export class BadRequestError extends AppError {
    constructor(message = "Bad Request", metadata?: Record<string, unknown>) {
        super(400, message, "BAD_REQUEST", metadata);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized", metadata?: Record<string, unknown>) {
        super(401, message, "UNAUTHORIZED", metadata);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden", metadata?: Record<string, unknown>) {
        super(403, message, "FORBIDDEN", metadata);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource Not Found", metadata?: Record<string, unknown>) {
        super(404, message, "NOT_FOUND", metadata);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict", metadata?: Record<string, unknown>) {
        super(409, message, "CONFLICT", metadata);
    }
}

export class UnprocessableEntityError extends AppError {
    constructor(message = "Unprocessable Entity", metadata?: Record<string, unknown>) {
        super(422, message, "UNPROCESSABLE_ENTITY", metadata);
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal Server Error", metadata?: Record<string, unknown>) {
        super(500, message, "INTERNAL_SERVER_ERROR", metadata);
    }
}
