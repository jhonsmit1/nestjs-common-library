import { AppError } from "../base/app.error";
export declare class BadRequestError extends AppError {
    constructor(message?: string, metadata?: Record<string, unknown>);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string, metadata?: Record<string, unknown>);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string, metadata?: Record<string, unknown>);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string, metadata?: Record<string, unknown>);
}
export declare class ConflictError extends AppError {
    constructor(message?: string, metadata?: Record<string, unknown>);
}
export declare class UnprocessableEntityError extends AppError {
    constructor(message?: string, metadata?: Record<string, unknown>);
}
export declare class InternalServerError extends AppError {
    constructor(message?: string, metadata?: Record<string, unknown>);
}
