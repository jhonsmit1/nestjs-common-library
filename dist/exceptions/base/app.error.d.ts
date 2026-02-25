export declare abstract class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly metadata?: Record<string, unknown> | undefined;
    readonly originalError?: unknown | undefined;
    readonly isOperational = true;
    constructor(statusCode: number, message: string, code: string, metadata?: Record<string, unknown> | undefined, originalError?: unknown | undefined);
    toJSON(): {
        name: string;
        statusCode: number;
        message: string;
        code: string;
        metadata: Record<string, unknown> | undefined;
    };
}
