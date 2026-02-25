"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRepositoryError = handleRepositoryError;
const app_error_1 = require("../base/app.error");
const http_errors_1 = require("../http/http.errors");
function handleRepositoryError(error, message) {
    if (error instanceof app_error_1.AppError) {
        throw error;
    }
    throw new http_errors_1.InternalServerError(message, {
        originalError: error instanceof Error ? error.message : String(error),
    });
}
//# sourceMappingURL=repository.helper.js.map