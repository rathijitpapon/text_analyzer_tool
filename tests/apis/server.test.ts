import httpStatus from 'http-status';
import supertest from 'supertest';
import { ExpressApplication } from '../../src/providers/expressApp';

describe('Application APIs', () => {
    it('should check application health', async () => {
        const healthCheckResponse = await supertest(await ExpressApplication.configure())
            .get('/api/health');

        expect(healthCheckResponse.status).toBe(httpStatus.OK);
    });

    it('should check application default api', async () => {
        const defaultResponse = await supertest(await ExpressApplication.configure())
            .get('/api/');

        expect(defaultResponse.status).toBe(httpStatus.OK);
    });

    it('should return 404 for invalid api', async () => {
        const invalidAPIResponse = await supertest(await ExpressApplication.configure())
            .get('/invalid');

        expect(invalidAPIResponse.status).toBe(httpStatus.NOT_FOUND);
    });
});