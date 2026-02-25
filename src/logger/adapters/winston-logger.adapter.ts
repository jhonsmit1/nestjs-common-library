import { Inject, Injectable } from "@nestjs/common";
import * as winston from "winston";
import LokiTransport from "winston-loki";
import WinstonCloudWatch from "winston-cloudwatch";
import { ILoggerAdapter } from "../interfaces/logger-adapter.interface";
import { LOGGER_OPTIONS } from "../logger.tokens";
import { LoggerModuleOptions } from "../interfaces/logger-options.interface";

@Injectable()
export class WinstonLoggerAdapter implements ILoggerAdapter {
    private logger: winston.Logger;

    constructor(
        @Inject(LOGGER_OPTIONS)
        private readonly options: LoggerModuleOptions
    ) {
        this.logger = this.createLogger();
    }

    private createLogger(): winston.Logger {
        const transports: winston.transport[] = [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                ),
            }),
        ];

        if (this.options.loki?.endpoint) {
            transports.push(
                new LokiTransport({
                    host: this.options.loki.endpoint,
                    basicAuth:
                        this.options.loki.username && this.options.loki.password
                            ? `${this.options.loki.username}:${this.options.loki.password}`
                            : undefined,
                    labels: {
                        service: this.options.serviceName,
                        environment: this.options.environment,
                    },
                    json: true,
                })
            );
        }

        if (this.options.cloudwatch?.region) {
            transports.push(
                new WinstonCloudWatch({
                    logGroupName: this.options.cloudwatch.logGroup,
                    logStreamName:
                        this.options.cloudwatch.logStream ||
                        `${this.options.serviceName}-${Date.now()}`,
                    awsRegion: this.options.cloudwatch.region,
                })
            );
        }

        return winston.createLogger({
            level: this.options.level || "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            transports,
        });
    }

    log(level: string, message: string, meta?: any) {
        this.logger.log(level, message, meta);
    }

    info(message: string, meta?: any) {
        this.logger.info(message, meta);
    }

    error(message: string, trace?: any, meta?: any) {
        this.logger.error(message, {
            ...(meta || {}),
            trace:
                trace instanceof Error
                    ? trace.stack
                    : trace,
        });
    }


    warn(message: string, meta?: any) {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: any) {
        this.logger.debug(message, meta);
    }

    verbose(message: string, meta?: any) {
        this.logger.verbose(message, meta);
    }
}
