import httpStatus from 'http-status';
import supertest from 'supertest';
import { ExpressApplication } from '../../src/providers/expressApp';
import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { Strategy as GoogleStrategy, VerifyFunctionWithRequest, VerifyCallback } from "passport-google-oauth2";
import { Environment } from '../../src/config/environment';
import { users } from '../data/user';

const googleOAuthConfig = Environment.getInstance().getGoogleOAuthConfig();

jest.mock('../../src/middlewares/oauth2', () => ({
    authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => {
        if (req.headers.cookie) {
            req.user = users[0];
            next();
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }
    }),
    authenticateWithGoogle: jest.fn(() => {
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
    }),
}));

describe('Auth APIs', () => {
    it('should return user data when authenticated', async () => {
        const response = await supertest(await ExpressApplication.configure())
            .get('/api/v1/auth/me')
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            name: users[0].displayName,
            email: users[0].email,
            picture: users[0].picture
        });
    });

    it('should return unauthorized when not authenticated', async () => {
        const response = await supertest(await ExpressApplication.configure())
            .get('/api/v1/auth/me')
            .send();

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});
