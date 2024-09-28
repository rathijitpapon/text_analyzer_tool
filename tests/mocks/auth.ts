import passport from 'passport';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';
import { Strategy as GoogleStrategy, VerifyFunctionWithRequest, VerifyCallback } from "passport-google-oauth2";
import { Environment } from '../../src/config/environment';
import { users } from '../data/user';

const googleOAuthConfig = Environment.getInstance().getGoogleOAuthConfig();

export const mockAuthenticationMiddleware = jest.fn((req: Request, res: Response, next: NextFunction) => {
    if (req.headers.cookie) {
        req.user = users[0];
        next();
    } else {
        res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }
});

export const mockGoogleOAuth2 = jest.fn(() => {
    // Simulate Google authentication
    const verify: VerifyFunctionWithRequest = (request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
        done(null, users[0]);
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
});