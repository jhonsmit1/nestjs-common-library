import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AppError } from "../base/app.error";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const timestamp = new Date().toISOString();
        const path = request.originalUrl || request.url;

        //  AppError (tu error de dominio)
        if (exception instanceof AppError) {
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

        //  Zod-like validation error (sin importar zod)
        if (this.isValidationError(exception)) {
            return response.status(400).json({
                data: null,
                error: {
                    statusCode: 400,
                    timestamp,
                    path,
                    message: (exception as any).errors ?? (exception as any).issues,
                },
                success: false,
            });
        }

        //  HttpException de Nest
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();

            return response.status(status).json({
                data: null,
                error: {
                    statusCode: status,
                    timestamp,
                    path,
                    message:
                        typeof res === "string"
                            ? res
                            : (res as any)?.message ?? res,
                },
                success: false,
            });
        }

        //  Fallback 500
        return response.status(500).json({
            data: null,
            error: {
                statusCode: 500,
                timestamp,
                path,
                message:
                    process.env.NODE_ENV === "production"
                        ? "Internal Server Error"
                        : (exception as any)?.message,
            },
            success: false,
        });
    }

    private isValidationError(exception: unknown): boolean {
        if (!exception || typeof exception !== "object") return false;

        const error = exception as any;

        return (
            error.name === "ZodError" ||
            Array.isArray(error.errors) ||
            Array.isArray(error.issues)
        );
    }
}
