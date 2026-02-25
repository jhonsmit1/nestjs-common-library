"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("../logger/logger.service");
const app_error_1 = require("../exceptions/base/app.error");
let HttpLoggingInterceptor = class HttpLoggingInterceptor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        if (context.getType() !== "http") {
            return next.handle();
        }
        const http = context.switchToHttp();
        const request = http.getRequest();
        const response = http.getResponse();
        const startTime = Date.now();
        const url = request.originalUrl || request.url;
        if (url?.includes("/metrics")) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            const payload = this.buildBasePayload(request, response.statusCode, duration);
            this.logByStatus(response.statusCode, request.method, url, payload);
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - startTime;
            const status = error instanceof app_error_1.AppError
                ? error.statusCode
                : error?.status || 500;
            const payload = {
                ...this.buildBasePayload(request, status, duration),
                errorCode: error instanceof app_error_1.AppError ? error.code : "UNKNOWN_ERROR",
                errorMessage: error instanceof Error ? error.message : String(error),
            };
            this.logger.error(`HTTP ${request.method} ${url}`, undefined, payload);
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
    buildBasePayload(request, status, duration) {
        return {
            method: request.method,
            url: request.originalUrl || request.url,
            status,
            duration,
            ip: request.ip || request.socket?.remoteAddress,
            userAgent: request.headers["user-agent"],
            headers: this.filterSensitiveHeaders(request.headers),
        };
    }
    logByStatus(status, method, url, payload) {
        if (status >= 500) {
            this.logger.error(`HTTP ${method} ${url}`, undefined, payload);
        }
        else if (status >= 400) {
            this.logger.warn(`HTTP ${method} ${url}`, payload);
        }
        else {
            this.logger.info(`HTTP ${method} ${url}`, payload);
        }
    }
    filterSensitiveHeaders(headers) {
        const sensitive = new Set([
            "authorization",
            "cookie",
            "x-api-key",
            "x-auth-token",
            "set-cookie",
        ]);
        return Object.fromEntries(Object.entries(headers).map(([key, value]) => [
            key,
            sensitive.has(key.toLowerCase()) ? "[REDACTED]" : value,
        ]));
    }
};
exports.HttpLoggingInterceptor = HttpLoggingInterceptor;
exports.HttpLoggingInterceptor = HttpLoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], HttpLoggingInterceptor);
//# sourceMappingURL=http-logging.interceptor.js.map