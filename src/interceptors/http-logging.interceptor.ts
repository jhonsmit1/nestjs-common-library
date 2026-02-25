import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== "http") {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const startTime = Date.now();
        const finalUrl = request.originalUrl || request.url;

        if (finalUrl?.includes("/metrics")) {
            return next.handle();
        }

        return next.handle().pipe(
            tap({
                next: (responseBody) => {
                    const payload = this.buildSuccessPayload(
                        request,
                        response,
                        responseBody,
                        startTime
                    );

                    this.logByStatus(payload.status, request.method, finalUrl, payload);
                },

                error: (error) => {
                    const payload = this.buildErrorPayload(
                        request,
                        error,
                        startTime
                    );

                    this.logger.error(
                        `HTTP ERROR ${request.method} ${finalUrl}`,
                        error,
                        payload
                    );
                },
            })
        );
    }

    private buildSuccessPayload(
        request: Request,
        response: Response,
        responseBody: any,
        startTime: number
    ) {
        const duration = Date.now() - startTime;

        const payload: Record<string, any> = {
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

    private buildErrorPayload(
        request: Request,
        error: any,
        startTime: number
    ) {
        const duration = Date.now() - startTime;

        let statusCode = 500;
        let message = "Internal Server Error";

        if (error instanceof HttpException) {
            statusCode = error.getStatus();
            const response = error.getResponse();
            message =
                typeof response === "string"
                    ? response
                    : (response as any)?.message || error.message;
        } else if (error?.message) {
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
        const sensitive = [
            "authorization",
            "cookie",
            "x-api-key",
            "x-auth-token",
            "set-cookie",
        ];

        const result: Record<string, any> = {};

        for (const key in headers) {
            if (sensitive.includes(key.toLowerCase())) {
                result[key] = "[REDACTED]";
            } else {
                result[key] = headers[key];
            }
        }

        return result;
    }
}
