import httpStatus from 'http-status';
import supertest from 'supertest';
import { Application } from 'express';
import { ExpressApplication } from '../../src/providers/expressApp';
import { users } from '../data/user';
import { mockGoogleOAuth2, mockAuthenticationMiddleware } from '../mocks/auth';

jest.mock('../../src/middlewares/oauth2', () => {
    return {
        authenticate: jest.fn().mockImplementation((req, res, next) => mockAuthenticationMiddleware(req, res, next)),
        authenticateWithGoogle: jest.fn().mockImplementation(() => mockGoogleOAuth2())
    };
});

describe('Auth APIs', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;

    beforeAll(async () => {
        app = await ExpressApplication.configure();
        request = supertest(app) as unknown as supertest.SuperTest<supertest.Test>;
    });

    it('should return user data when authenticated', async () => {
        const response = await request
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
        const response = await request
            .get('/api/v1/auth/me')
            .send();

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
});
