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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinstonLoggerAdapter = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const winston_loki_1 = require("winston-loki");
const winston_cloudwatch_1 = require("winston-cloudwatch");
const logger_tokens_1 = require("../logger.tokens");
let WinstonLoggerAdapter = class WinstonLoggerAdapter {
    options;
    logger;
    constructor(options) {
        this.options = options;
        this.logger = this.createLogger();
    }
    createLogger() {
        const transports = [
            new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
            }),
        ];
        if (this.options.loki?.endpoint) {
            transports.push(new winston_loki_1.default({
                host: this.options.loki.endpoint,
                basicAuth: this.options.loki.username && this.options.loki.password
                    ? `${this.options.loki.username}:${this.options.loki.password}`
                    : undefined,
                labels: {
                    service: this.options.serviceName,
                    environment: this.options.environment,
                },
                json: true,
            }));
        }
        if (this.options.cloudwatch?.region) {
            transports.push(new winston_cloudwatch_1.default({
                logGroupName: this.options.cloudwatch.logGroup,
                logStreamName: this.options.cloudwatch.logStream ||
                    `${this.options.serviceName}-${Date.now()}`,
                awsRegion: this.options.cloudwatch.region,
            }));
        }
        return winston_1.default.createLogger({
            level: this.options.level || "info",
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
            transports,
        });
    }
    log(level, message, meta) {
        this.logger.log(level, message, meta);
    }
    info(message, meta) {
        this.logger.info(message, meta);
    }
    error(message, trace, meta) {
        this.logger.error(message, {
            ...(meta || {}),
            trace: trace instanceof Error
                ? trace.stack
                : trace,
        });
    }
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    debug(message, meta) {
        this.logger.debug(message, meta);
    }
    verbose(message, meta) {
        this.logger.verbose(message, meta);
    }
};
exports.WinstonLoggerAdapter = WinstonLoggerAdapter;
exports.WinstonLoggerAdapter = WinstonLoggerAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_tokens_1.LOGGER_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], WinstonLoggerAdapter);
//# sourceMappingURL=winston-logger.adapter.js.map