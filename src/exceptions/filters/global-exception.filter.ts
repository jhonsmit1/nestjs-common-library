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

        const requestId = request.headers["x-request-id"];

        if (exception instanceof AppError) {
            return response.status(exception.statusCode).json({
                code: exception.code,
                message: exception.message,
                metadata: exception.metadata,
                requestId,
            });
        }

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();

            return response.status(status).json({
                code: "HTTP_EXCEPTION",
                message: res,
                requestId,
            });
        }

        return response.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message:
                process.env.NODE_ENV === "production"
                    ? "Internal Server Error"
                    : (exception as any)?.message,
            requestId,
        });
    }
}
