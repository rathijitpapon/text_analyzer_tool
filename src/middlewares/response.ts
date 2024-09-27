import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

import { ApiLogger } from '../utils/apiLogger';
import { ApplicationLogger } from '../utils/appLogger';
import { LogType } from '../types/log';
import { ApplicationModes } from '../types/application';
import { Environment } from '../config/environment';
import { parseZodSchema } from '../utils/zod';

export class ResponseHandler {
    private request: Request;
    private response: Response;
    private next: NextFunction;
    private statusCode: number;
    private responseData: any;
    private responseSchema: ZodSchema;
    private appConfig = Environment.getInstance().getAppConfig();

    constructor(
        request: Request,
        response: Response,
        next: NextFunction,
        statusCode: number,
        responseData: any,
        responseSchema: ZodSchema
    ) {
        this.request = request;
        this.response = response;
        this.next = next;
        this.statusCode = statusCode;
        this.responseData = responseData;
        this.responseSchema = responseSchema;
    }

    async execute(): Promise<void> {
        // Validate the response against the schema
        this.responseData = parseZodSchema(this.responseSchema, this.responseData);
        
        // Write the response in the log file if the environment is production
        if (this.appConfig.mode === ApplicationModes.PRODUCTION) {
            new ApiLogger(this.request, this.statusCode, this.responseData).write();
        } else if (this.appConfig.mode === ApplicationModes.DEVELOPMENT) {
            let logType: LogType;
            if (this.statusCode < 300) {
                logType = 'SUCCESS';
            } else if (this.statusCode < 400) {
                logType = 'WARN';
            } else {
                logType = 'ERROR';
            }

            new ApplicationLogger(logType, JSON.stringify(this.responseData)).write();
        }
        
        // Send the response to the client
        if (this.responseData) {
            this.response.status(this.statusCode).send(this.responseData);
        } else {
            this.response.status(this.statusCode).end();
        }
    }
}
