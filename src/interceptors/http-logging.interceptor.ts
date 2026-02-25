import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { AppError } from "../exceptions/base/app.error";

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== "http") {
            return next.handle();
        }

        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const startTime = Date.now();
        const url = request.originalUrl || request.url;

        // Ignore metrics endpoint
        if (url?.includes("/metrics")) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - startTime;

                const payload = this.buildBasePayload(
                    request,
                    response.statusCode,
                    duration
                );

                this.logByStatus(response.statusCode, request.method, url, payload);
            }),

            catchError((error) => {
                const duration = Date.now() - startTime;

                const status =
                    error instanceof AppError
                        ? error.statusCode
                        : error?.status || 500;

                const payload = {
                    ...this.buildBasePayload(request, status, duration),
                    errorCode: error instanceof AppError ? error.code : "UNKNOWN_ERROR",
                    errorMessage:
                        error instanceof Error ? error.message : String(error),
                };

                this.logByStatus(status, request.method, url, payload);

                return throwError(() => error);
            })
        );
    }

    private buildBasePayload(
        request: Request,
        status: number,
        duration: number
    ) {
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

    private logByStatus(
        status: number,
        method: string,
        url: string,
        payload: any
    ) {
        if (status >= 500) {
            this.logger.error(`HTTP ${method} ${url}`, undefined, payload);
        } else if (status >= 400) {
            this.logger.warn(`HTTP ${method} ${url}`, payload);
        } else {
            this.logger.info(`HTTP ${method} ${url}`, payload);
        }
    }

    private filterSensitiveHeaders(
        headers: Record<string, any>
    ): Record<string, any> {
        const sensitive = new Set([
            "authorization",
            "cookie",
            "x-api-key",
            "x-auth-token",
            "set-cookie",
        ]);

        return Object.fromEntries(
            Object.entries(headers).map(([key, value]) => [
                key,
                sensitive.has(key.toLowerCase()) ? "[REDACTED]" : value,
            ])
        );
    }
}
