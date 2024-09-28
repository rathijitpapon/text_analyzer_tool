import passport from "passport";
import { Strategy as GoogleStrategy, VerifyFunctionWithRequest, VerifyCallback } from "passport-google-oauth2";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ApiError } from "../utils/apiError";
import { Environment } from "../config/environment";

const googleOAuthConfig = Environment.getInstance().getGoogleOAuthConfig();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'This API route is protected. Please login to access.'));
    }
}

export const authenticateWithGoogle = (): void => {
    const verify: VerifyFunctionWithRequest = (request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        console.log(accessToken, refreshToken, profile);
        done(null, profile);
    };

    passport.use(new GoogleStrategy({
        clientID: googleOAuthConfig.clientID,
        clientSecret: googleOAuthConfig.clientSecret,
        callbackURL: googleOAuthConfig.callbackURL,
        passReqToCallback: true,
        scope: ['profile', 'email']
    }, verify));

    passport.serializeUser((user: any, done: VerifyCallback) => {
        done(null, user);
    });

    passport.deserializeUser((user: any, done: VerifyCallback) => {
        done(null, user);
    });
}