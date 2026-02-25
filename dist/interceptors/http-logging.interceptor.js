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
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("../logger/logger.service");
let HttpLoggingInterceptor = class HttpLoggingInterceptor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        if (context.getType() !== "http") {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const startTime = Date.now();
        const finalUrl = request.originalUrl || request.url;
        if (finalUrl?.includes("/metrics")) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)({
            next: (responseBody) => {
                const payload = this.buildSuccessPayload(request, response, responseBody, startTime);
                this.logByStatus(payload.status, request.method, finalUrl, payload);
            },
            error: (error) => {
                const payload = this.buildErrorPayload(request, error, startTime);
                this.logger.error(`HTTP ERROR ${request.method} ${finalUrl}`, error, payload);
            },
        }));
    }
    buildSuccessPayload(request, response, responseBody, startTime) {
        const duration = Date.now() - startTime;
        const payload = {
            method: request.method,
            url: request.originalUrl || request.url,
            status: response.statusCode,
            duration,
            ip: request.ip || request.socket?.remoteAddress,
            userAgent: request.headers["user-agent"],
            headers: this.filterSensitiveHeaders(request.headers),
        };
        if (request.query && Object.keys(request.query).length > 0) {
            payload.query = request.query;
        }
        if (request.body && Object.keys(request.body).length > 0) {
            payload.requestBody = request.body;
        }
        if (responseBody) {
            payload.responseBody = responseBody;
        }
        return payload;
    }
    buildErrorPayload(request, error, startTime) {
        const duration = Date.now() - startTime;
        let statusCode = 500;
        let message = "Internal Server Error";
        if (error instanceof common_1.HttpException) {
            statusCode = error.getStatus();
            const response = error.getResponse();
            message =
                typeof response === "string"
                    ? response
                    : response?.message || error.message;
        }
        else if (error?.message) {
            message = error.message;
        }
        return {
            method: request.method,
            url: request.originalUrl || request.url,
            status: statusCode,
            duration,
            ip: request.ip || request.socket?.remoteAddress,
            userAgent: request.headers["user-agent"],
            headers: this.filterSensitiveHeaders(request.headers),
            errorMessage: message,
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
        const sensitive = [
            "authorization",
            "cookie",
            "x-api-key",
            "x-auth-token",
            "set-cookie",
        ];
        const result = {};
        for (const key in headers) {
            if (sensitive.includes(key.toLowerCase())) {
                result[key] = "[REDACTED]";
            }
            else {
                result[key] = headers[key];
            }
        }
        return result;
    }
};
exports.HttpLoggingInterceptor = HttpLoggingInterceptor;
exports.HttpLoggingInterceptor = HttpLoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], HttpLoggingInterceptor);
//# sourceMappingURL=http-logging.interceptor.js.map