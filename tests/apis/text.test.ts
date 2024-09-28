import httpStatus from 'http-status';
import supertest from 'supertest';
import { ExpressApplication } from '../../src/providers/expressApp';
import { texts } from "../data/text";
import { Postgres } from '../../src/providers/postgres';

describe('Text APIs', () => {

    beforeAll(async () => {
        const postgres = await Postgres.getInstance();
        await postgres.query('DELETE FROM texts');
    });

    afterEach(async () => {
        const postgres = await Postgres.getInstance();
        await postgres.query('DELETE FROM texts');
    });

    it('should create new text', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        expect(textCreateResponse.status).toEqual(httpStatus.CREATED);
        expect(textCreateResponse.body.text).toEqual(textObject.text);
        expect(textCreateResponse.body.id).toBeDefined();
        expect(textCreateResponse.body.wordCount).toEqual(textObject.wordCount);
        expect(textCreateResponse.body.characterCount).toEqual(textObject.characterCount);
        expect(textCreateResponse.body.sentenceCount).toEqual(textObject.sentenceCount);
        expect(textCreateResponse.body.paragraphCount).toEqual(textObject.paragraphCount);
        expect(textCreateResponse.body.longestParagraphWords).toEqual(textObject.longestParagraphWords);
    });

    it('should not create new text with invalid text', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: '',
            })

        expect(textCreateResponse.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should get text by id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textGetResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${textCreateResponse.body.id}`)
            .send();

        expect(textGetResponse.status).toEqual(httpStatus.OK);
        expect(textGetResponse.body.text).toEqual(textObject.text);
        expect(textGetResponse.body.id).toEqual(textCreateResponse.body.id);
        expect(textGetResponse.body.wordCount).toEqual(textObject.wordCount);
        expect(textGetResponse.body.characterCount).toEqual(textObject.characterCount);
        expect(textGetResponse.body.sentenceCount).toEqual(textObject.sentenceCount);
        expect(textGetResponse.body.paragraphCount).toEqual(textObject.paragraphCount);
        expect(textGetResponse.body.longestParagraphWords).toEqual(textObject.longestParagraphWords);
    });

    it('should not get text by id with invalid id', async () => {
        const invalidUuid = 'e3028a62-0c1c-42da-bcaa-b73fa06b7366';
        const textGetResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${invalidUuid}`)
            .send();

        expect(textGetResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should get unprocessable entity with invalid uuid', async () => {
        const invalidUuid = '123';
        const textGetResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${invalidUuid}`)
            .send();

        expect(textGetResponse.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should update text by id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const newText = texts[1];
        const textUpdateResponse = await supertest(await ExpressApplication.configure())
            .patch(`/api/v1/texts/${textCreateResponse.body.id}`)
            .send({
                text: newText.text,
            });

        expect(textUpdateResponse.status).toEqual(httpStatus.OK);
        expect(textUpdateResponse.body.text).toEqual(newText.text);
        expect(textUpdateResponse.body.id).toEqual(textCreateResponse.body.id);
        expect(textUpdateResponse.body.wordCount).toEqual(newText.wordCount);
        expect(textUpdateResponse.body.characterCount).toEqual(newText.characterCount);
        expect(textUpdateResponse.body.sentenceCount).toEqual(newText.sentenceCount);
        expect(textUpdateResponse.body.paragraphCount).toEqual(newText.paragraphCount);
        expect(textUpdateResponse.body.longestParagraphWords).toEqual(newText.longestParagraphWords);
    });

    it('should not update text by id with invalid id', async () => {
        const invalidUuid = 'e3028a62-0c1c-42da-bcaa-b73fa06b7366';
        const textUpdateResponse = await supertest(await ExpressApplication.configure())
            .patch(`/api/v1/texts/${invalidUuid}`)
            .send({
                text: texts[1].text,
            });

        expect(textUpdateResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should not update text by id with invalid text', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textUpdateResponse = await supertest(await ExpressApplication.configure())
            .patch(`/api/v1/texts/${textCreateResponse.body.id}`)
            .send({
                text: '',
            });

        expect(textUpdateResponse.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should delete text by id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textDeleteResponse = await supertest(await ExpressApplication.configure())
            .delete(`/api/v1/texts/${textCreateResponse.body.id}`)
            .send();

        expect(textDeleteResponse.status).toEqual(httpStatus.OK);

        const textGetResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${textCreateResponse.body.id}`)
            .send();

        expect(textGetResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should not delete text by id with invalid id', async () => {
        const invalidUuid = 'e3028a62-0c1c-42da-bcaa-b73fa06b7366';
        const textDeleteResponse = await supertest(await ExpressApplication.configure())
            .delete(`/api/v1/texts/${invalidUuid}`)
            .send();

        expect(textDeleteResponse.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should not delete text by id with invalid uuid', async () => {
        const invalidUuid = '123';
        const textDeleteResponse = await supertest(await ExpressApplication.configure())
            .delete(`/api/v1/texts/${invalidUuid}`)
            .send();

        expect(textDeleteResponse.status).toEqual(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should get all texts', async () => {
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: texts[0].text,
            });

        const textCreateResponse2 = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: texts[1].text,
            });

        const textGetResponse = await supertest(await ExpressApplication.configure())
            .get('/api/v1/texts')
            .send();

        expect(textGetResponse.status).toEqual(httpStatus.OK);
        expect(textGetResponse.body.length).toEqual(2);
        expect(textGetResponse.body[0].text).toEqual(texts[0].text);
        expect(textGetResponse.body[1].text).toEqual(texts[1].text);
        expect(textGetResponse.body[0].id).toEqual(textCreateResponse.body.id);
        expect(textGetResponse.body[1].id).toEqual(textCreateResponse2.body.id);
    });

    it('should get word count for a text id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textWordCountResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${textCreateResponse.body.id}/word-count`)
            .send();

        expect(textWordCountResponse.status).toEqual(httpStatus.OK);
        expect(textWordCountResponse.body.wordCount).toEqual(textObject.wordCount);
    });

    it('should get character count for a text id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textCharacterCountResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${textCreateResponse.body.id}/character-count`)
            .send();

        expect(textCharacterCountResponse.status).toEqual(httpStatus.OK);
        expect(textCharacterCountResponse.body.characterCount).toEqual(textObject.characterCount);
    });

    it('should get sentence count for a text id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textSentenceCountResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${textCreateResponse.body.id}/sentence-count`)
            .send();

        expect(textSentenceCountResponse.status).toEqual(httpStatus.OK);
        expect(textSentenceCountResponse.body.sentenceCount).toEqual(textObject.sentenceCount);
    });

    it('should get paragraph count for a text id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textParagraphCountResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${textCreateResponse.body.id}/paragraph-count`)
            .send();

        expect(textParagraphCountResponse.status).toEqual(httpStatus.OK);
        expect(textParagraphCountResponse.body.paragraphCount).toEqual(textObject.paragraphCount);
    });

    it('should get longest paragraph words for a text id', async () => {
        const textObject = texts[0];
        const textCreateResponse = await supertest(await ExpressApplication.configure())
            .post('/api/v1/texts')
            .send({
                text: textObject.text,
            });

        const textLongestParagraphWordsResponse = await supertest(await ExpressApplication.configure())
            .get(`/api/v1/texts/${textCreateResponse.body.id}/longest-paragraph-words`)
            .send();

        expect(textLongestParagraphWordsResponse.status).toEqual(httpStatus.OK);
        expect(textLongestParagraphWordsResponse.body.longestParagraphWords).toEqual(textObject.longestParagraphWords);
    });
});
