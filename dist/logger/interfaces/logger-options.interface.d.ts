export interface LoggerModuleOptions {
    level?: string;
    serviceName: string;
    environment: string;
    loki?: {
        endpoint: string;
        username?: string;
        password?: string;
    };
    cloudwatch?: {
        region: string;
        logGroup: string;
        logStream?: string;
    };
}
