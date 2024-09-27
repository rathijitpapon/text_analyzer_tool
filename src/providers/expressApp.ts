import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import passport from 'passport';
import compression from 'compression';
import { ApiError } from '../utils/apiError';
import { Environment } from '../config/environment';
import { APIEndpoints } from '../apis';
import { ErrorHandler } from '../middlewares/error';
import { setDefaultRequestProperties } from '../middlewares/request';

export class ExpressApplication {
    private static appConfig = Environment.getInstance().getAppConfig();

    public static async configure(): Promise<Application> {
        const app = express();

        // set security HTTP headers
        app.use(helmet());

        // parse json request body
        app.use(express.json());

        // parse urlencoded request body
        app.use(express.urlencoded({ extended: true, limit: '10mb', parameterLimit: 100 }));

        // sanitize request data
        app.use(express.json({ limit: '10mb' }));

        // enable gzip compression
        app.use(compression());

        // enable cors
        const whitelist = ExpressApplication.appConfig.allowedOrigins;
        app.use(
            cors(
                {
                    origin: (origin, callback) => {
                    if (!origin || whitelist.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        callback(new ApiError(httpStatus.NOT_ACCEPTABLE, 'The CORS policy for this site does not allow access from the specified Origin.'));
                    }
                    },
                    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
                    credentials: true,
                    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-CSRF-Token'],
                }
            )
        );
        app.options('*', cors());

        // Set Passport Authentication
        app.use(passport.initialize());

        // Set Default Request Properties
        app.use(setDefaultRequestProperties);

        // Set api routes
        app.use('/api', new APIEndpoints().register());

        // send back a 404 error for any unknown api request
        app.use((req: Request, res: Response, next: NextFunction) => {
            next(new ApiError(httpStatus.NOT_FOUND, 'This API route does not exist.'));
        });

        // handle error
        app.use(ErrorHandler.resolveApplicationError);
        app.use(ErrorHandler.resolveUncaughtException);

        // Set Trust Proxy
        app.set('trust proxy', true);

        return app;
    }
}