import { LogType, Logger } from "../types/log";
import { Environment } from "../config/environment";

/*
    Log Format: Y-m-d h:i:s | app name | app mode: PRODUCTION/DEVELOPMENT/TEST | log type: ERROR/WARN/SUCCESS | message
*/

export class ApplicationLogger implements Logger {
    private logType: LogType;
    private message: string;
    private appConfig = Environment.getInstance().getAppConfig();

    constructor(logType: LogType, message: string) {
        this.logType = logType;
        this.message = message;
    }

    async write(): Promise<void> {
        if (this.appConfig.mode === 'test') {
            return;
        }

        // Set Current Date and Time
        const dateTime = new Date();
        const dateFormat = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()}`;
        const timeFormat = `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;

        // Set Application Data
        const appName = this.appConfig.name;
        const appMode = this.appConfig.mode;

        // Construct Log
        const logFormat = `${dateFormat} ${timeFormat} | ${appName} | ${appMode} | ${this.logType} | ${this.message}`;

        // Write Log
        console.log(logFormat);
    }
}