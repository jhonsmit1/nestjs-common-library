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
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const logger_tokens_1 = require("./logger.tokens");
const request_context_1 = require("../context/request-context");
let LoggerService = class LoggerService {
    logger;
    options;
    constructor(logger, options) {
        this.logger = logger;
        this.options = options;
    }
    enrichMeta(meta) {
        const requestId = (0, request_context_1.getRequestId)();
        return {
            service: this.options.serviceName,
            environment: this.options.environment,
            timestamp: new Date().toISOString(),
            ...(requestId && { requestId }),
            ...(meta || {}),
        };
    }
    log(level, message, meta) {
        this.logger.log(level, message, this.enrichMeta(meta));
    }
    info(message, meta) {
        this.logger.info(message, this.enrichMeta(meta));
    }
    warn(message, meta) {
        this.logger.warn(message, this.enrichMeta(meta));
    }
    debug(message, meta) {
        this.logger.debug(message, this.enrichMeta(meta));
    }
    verbose(message, meta) {
        this.logger.verbose(message, this.enrichMeta(meta));
    }
    error(message, trace, meta) {
        this.logger.error(message, trace, this.enrichMeta(meta));
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_tokens_1.LOGGER_ADAPTER)),
    __param(1, (0, common_1.Inject)(logger_tokens_1.LOGGER_OPTIONS)),
    __metadata("design:paramtypes", [Object, Object])
], LoggerService);
//# sourceMappingURL=logger.service.js.map