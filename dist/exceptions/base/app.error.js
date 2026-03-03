"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    metadata;
    originalError;
    isOperational = true;
    constructor(statusCode, message, code, metadata, originalError) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.metadata = metadata;
        this.originalError = originalError;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            name: this.name,
            statusCode: this.statusCode,
            message: this.message,
            code: this.code,
            metadata: this.metadata,
        };
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app.error.js.map