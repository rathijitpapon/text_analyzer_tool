import httpStatus from 'http-status';
import supertest from 'supertest';
import { Application } from 'express';
import { ExpressApplication } from '../../src/providers/expressApp';
import { texts } from "../data/text";
import { Postgres } from '../../src/providers/postgres';
import { mockGoogleOAuth2, mockAuthenticationMiddleware } from '../mocks/auth';

jest.mock('../../src/middlewares/oauth2', () => {
    return {
        authenticate: jest.fn().mockImplementation((req, res, next) => mockAuthenticationMiddleware(req, res, next)),
        authenticateWithGoogle: jest.fn().mockImplementation(() => mockGoogleOAuth2())
    };
});

describe('Text APIs', () => {
    let request: supertest.SuperTest<supertest.Test>;
    let app: Application;

    beforeAll(async () => {
        app = await ExpressApplication.configure();
        request = supertest(app) as unknown as supertest.SuperTest<supertest.Test>;
        const postgres = await Postgres.getInstance();
        await postgres.query('DELETE FROM texts');
    });

    afterEach(async () => {
        const postgres = await Postgres.getInstance();
        await postgres.query('DELETE FROM texts');
    });

    const createText = async (text: string) => {
        const response = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .set('Cookie', ['connect.sid=test-session-id'])
            .send({ text });
        return response;
    };

    const checkTextResponse = (response: any, expectedText: any) => {
        expect(response.body.text).toEqual(expectedText.text);
        expect(response.body.id).toBeDefined();
        expect(response.body.wordCount).toEqual(expectedText.wordCount);
        expect(response.body.characterCount).toEqual(expectedText.characterCount);
        expect(response.body.sentenceCount).toEqual(expectedText.sentenceCount);
        expect(response.body.paragraphCount).toEqual(expectedText.paragraphCount);
        expect(response.body.longestParagraphWords).toEqual(expectedText.longestParagraphWords);
    };

    it('should create new text', async () => {
        const response = await createText(texts[0].text);
        expect(response.status).toEqual(httpStatus.CREATED);
        checkTextResponse(response, texts[0]);
    });

    it('should not create new text with invalid text', async () => {
        const response = await createText('');
        expect(response.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should get text by id', async () => {
        const createResponse = await createText(texts[0].text);
        const getResponse = await request
            .get(`/api/v1/texts/${createResponse.body.id}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(getResponse.status).toEqual(httpStatus.OK);
        checkTextResponse(getResponse, texts[0]);
    });

    it('should not get text by id with invalid id', async () => {
        const invalidUuid = 'e3028a62-0c1c-42da-bcaa-b73fa06b7366';
        const textGetResponse = await request
            .get(`/api/v1/texts/${invalidUuid}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(textGetResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should get unprocessable entity with invalid uuid', async () => {
        const invalidUuid = '123';
        const textGetResponse = await request
            .get(`/api/v1/texts/${invalidUuid}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(textGetResponse.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should update text by id', async () => {
        const createResponse = await createText(texts[0].text);
        const updateResponse = await request
            .patch(`/api/v1/texts/${createResponse.body.id}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send({ text: texts[1].text });

        expect(updateResponse.status).toEqual(httpStatus.OK);
        checkTextResponse(updateResponse, texts[1]);
    });

    it('should not update text by id with invalid id', async () => {
        const invalidUuid = 'e3028a62-0c1c-42da-bcaa-b73fa06b7366';
        const updateResponse = await request
            .patch(`/api/v1/texts/${invalidUuid}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send({ text: texts[1].text });

        expect(updateResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should not update text by id with invalid text', async () => {
        const createResponse = await createText(texts[0].text);
        const updateResponse = await request
            .patch(`/api/v1/texts/${createResponse.body.id}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send({ text: '' });

        expect(updateResponse.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should delete text by id', async () => {
        const createResponse = await createText(texts[0].text);
        const deleteResponse = await request
            .delete(`/api/v1/texts/${createResponse.body.id}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(deleteResponse.status).toEqual(httpStatus.OK);

        const getResponse = await request
            .get(`/api/v1/texts/${createResponse.body.id}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(getResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should not delete text by id with invalid id', async () => {
        const invalidUuid = 'e3028a62-0c1c-42da-bcaa-b73fa06b7366';
        const deleteResponse = await request
            .delete(`/api/v1/texts/${invalidUuid}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(deleteResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should not delete text by id with invalid uuid', async () => {
        const invalidUuid = '123';
        const deleteResponse = await request
            .delete(`/api/v1/texts/${invalidUuid}`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(deleteResponse.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should get all texts', async () => {
        await createText(texts[0].text);
        await createText(texts[1].text);

        const response = await request
            .get('/api/v1/texts')
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body.length).toEqual(2);
        expect(response.body[0].text).toEqual(texts[0].text);
        expect(response.body[1].text).toEqual(texts[1].text);
    });

    it('should get word count for a text id', async () => {
        const createResponse = await createText(texts[0].text);
        const wordCountResponse = await request
            .get(`/api/v1/texts/${createResponse.body.id}/word-count`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(wordCountResponse.status).toEqual(httpStatus.OK);
        expect(wordCountResponse.body.wordCount).toEqual(texts[0].wordCount);
    });

    it('should get character count for a text id', async () => {
        const createResponse = await createText(texts[0].text);
        const characterCountResponse = await request
            .get(`/api/v1/texts/${createResponse.body.id}/character-count`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(characterCountResponse.status).toEqual(httpStatus.OK);
        expect(characterCountResponse.body.characterCount).toEqual(texts[0].characterCount);
    });

    it('should get sentence count for a text id', async () => {
        const createResponse = await createText(texts[0].text);
        const sentenceCountResponse = await request
            .get(`/api/v1/texts/${createResponse.body.id}/sentence-count`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(sentenceCountResponse.status).toEqual(httpStatus.OK);
        expect(sentenceCountResponse.body.sentenceCount).toEqual(texts[0].sentenceCount);
    });

    it('should get paragraph count for a text id', async () => {
        const createResponse = await createText(texts[0].text);
        const paragraphCountResponse = await request
            .get(`/api/v1/texts/${createResponse.body.id}/paragraph-count`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(paragraphCountResponse.status).toEqual(httpStatus.OK);
        expect(paragraphCountResponse.body.paragraphCount).toEqual(texts[0].paragraphCount);
    });

    it('should get longest paragraph words for a text id', async () => {
        const createResponse = await createText(texts[0].text);
        const longestParagraphWordsResponse = await request
            .get(`/api/v1/texts/${createResponse.body.id}/longest-paragraph-words`)
            .set('Cookie', ['connect.sid=test-session-id'])
            .send();

        expect(longestParagraphWordsResponse.status).toEqual(httpStatus.OK);
        expect(longestParagraphWordsResponse.body.longestParagraphWords).toEqual(texts[0].longestParagraphWords);
    });
});