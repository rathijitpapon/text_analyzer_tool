import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiLogger } from '../utils/apiLogger';
import { ApplicationLogger } from '../utils/appLogger';
import { Environment } from '../config/environment';

export class ErrorHandler {
    private static appConfig = Environment.getInstance().getAppConfig();

    public static async resolveUncaughtException(error: Error, req: Request, res: Response, next: NextFunction) {
        // Convert express validation error to ApiError
        if (!(error instanceof ApiError)) {
            const statusCode = httpStatus.INTERNAL_SERVER_ERROR
            const message = error.message || httpStatus[statusCode]
            error = new ApiError(statusCode, message, false, error.stack)
        }

        // Call the next middleware with error
        next(error);
    }

    public static async buildErrorResponse(error: ApiError | any, req: Request, res: Response): Promise<{ statusCode: number, response: Object }> {
        // Set default values
        let statusCode = +httpStatus.INTERNAL_SERVER_ERROR;
        let message = error.message;
        let isOperational = false;

        // If the error is an instance of ApiError, set values accordingly
        if (error instanceof ApiError) {
            statusCode = error.statusCode;
            isOperational = error.isOperational;
        }

        // If the error is not operational, set the message to generic message
        if (ErrorHandler.appConfig.mode === 'production' && !isOperational) {
            statusCode = +httpStatus.INTERNAL_SERVER_ERROR;
            message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
        }

        // Set the start time of the request if it is not set
        // if (ErrorHandler.appConfig.mode === 'production' && !req.startTime) {
        //     req.startTime = new Date();
        // }

        // Set res.locals values
        res.locals.errorMessage = error.message;

        // Prepare response object
        const response = {
            code: statusCode,
            message,
            ...(ErrorHandler.appConfig.mode === 'development' && { stack: error.stack }),
        };

        // Log error message
        if (ErrorHandler.appConfig.mode === 'production') {
            new ApiLogger(req, statusCode, { message }).write();
        } else if (ErrorHandler.appConfig.mode === 'development') {
            new ApplicationLogger('ERROR', JSON.stringify(response)).write();
        }

        return { statusCode, response };
    }


    public static async resolveApplicationError(error: ApiError | any, req: Request, res: Response, next: NextFunction) {
        const { statusCode, response } = await ErrorHandler.buildErrorResponse(error, req, res);

        // Send response to client
        res.status(statusCode).send(response);
        next();
    }
}