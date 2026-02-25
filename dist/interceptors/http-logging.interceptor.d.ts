import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { LoggerService } from "../logger/logger.service";
export declare class HttpLoggingInterceptor implements NestInterceptor {
    private readonly logger;
    constructor(logger: LoggerService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private buildSuccessPayload;
    private buildErrorPayload;
    private logByStatus;
    private filterSensitiveHeaders;
}
