import { Request } from 'express';
import { LogType, Logger } from "../types/log";
import { Environment } from "../config/environment";

/*
    Log Format: Y-m-d h:i:s | app name | app mode: PRODUCTION/DEVELOPMENT/TEST | log type: ERROR/WARN/SUCCESS | user Id | email | user IP | user web agent | requested URL | execution time | response code | request data | response data | error message
*/

export class ApiLogger implements Logger {
    private request: Request;
    private statusCode: number;
    private responseData: Record<string, any>;
    private appConfig = Environment.getInstance().getAppConfig();

    constructor(request: Request, statusCode: number, responseData: Record<string, any>) {
        this.request = request;
        this.statusCode = statusCode;
        this.responseData = responseData;
    }

    private async maskSensitiveData(obj: Record<string, any>, sensitiveKeys: string[]): Promise<Record<string, any>> {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (sensitiveKeys.includes(key.toLowerCase())) {
                    obj[key] = '********';
                }
            }
        }

        return obj;
    }

    async write(): Promise<void> {
        if (this.appConfig.mode === 'test') {
            return;
        }

        // Set log type
        let logType: LogType;
        if (this.statusCode < 300) {
            logType = 'SUCCESS';
        } else if (this.statusCode < 400) {
            logType = 'WARN';
        } else {
            logType = 'ERROR';
        }

        // Set user data
        // const userId = this.request.user ? this.request.user.id : '';
        // const email = this.request.user ? this.request.user.email : '';

        // Set application and network data
        const userIp = this.request.ip || '';
        const userAgent = this.request.headers['user-agent'] || '';
        const requestedUrl = this.request.originalUrl;
        // const executionTime = new Date().getTime() - this.request.startTime.getTime();
        const appName = this.appConfig.name;
        const appMode = this.appConfig.mode;

        // Set request and response data and mask sensitive data
        const requestLogs = JSON.stringify({
            body: this.maskSensitiveData(this.request.query, ['password']),
            query: this.maskSensitiveData(this.request.query, ['password']),
            params: this.maskSensitiveData(this.request.params, ['password']),
            headers: this.maskSensitiveData(this.request.query, ['headers']),
        });
        const responseLogs = JSON.stringify(this.responseData);

        // Set date and time
        const dateTime = new Date();
        const dateFormat = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()}`;
        const timeFormat = `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;

        // Construct log
        const logFormat = `${dateFormat} ${timeFormat} | ${appName} | ${appMode} | ${logType} | ${userIp} | ${userAgent} | ${requestedUrl} | ${this.statusCode} | ${requestLogs} | ${responseLogs}`;

        // Write log depending on status code
        console.log(logFormat);
    }
}