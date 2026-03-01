"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const app_error_1 = require("../base/app.error");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const timestamp = new Date().toISOString();
        const path = request.originalUrl || request.url;
        if (exception instanceof app_error_1.AppError) {
            return response.status(exception.statusCode).json({
                data: null,
                error: {
                    statusCode: exception.statusCode,
                    timestamp,
                    path,
                    message: exception.message,
                },
                success: false,
            });
        }
        if (this.isValidationError(exception)) {
            return response.status(400).json({
                data: null,
                error: {
                    statusCode: 400,
                    timestamp,
                    path,
                    message: exception.errors ?? exception.issues,
                },
                success: false,
            });
        }
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            return response.status(status).json({
                data: null,
                error: {
                    statusCode: status,
                    timestamp,
                    path,
                    message: typeof res === "string"
                        ? res
                        : res?.message ?? res,
                },
                success: false,
            });
        }
        return response.status(500).json({
            data: null,
            error: {
                statusCode: 500,
                timestamp,
                path,
                message: process.env.NODE_ENV === "production"
                    ? "Internal Server Error"
                    : exception?.message,
            },
            success: false,
        });
    }
    isValidationError(exception) {
        if (!exception || typeof exception !== "object")
            return false;
        const error = exception;
        return (error.name === "ZodError" ||
            Array.isArray(error.errors) ||
            Array.isArray(error.issues));
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=global-exception.filter.js.map