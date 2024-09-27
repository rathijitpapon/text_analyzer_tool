import httpStatus from 'http-status';
import supertest from 'supertest';
import { ExpressApplication } from '../../src/providers/expressApp';
import { texts } from "../data/text";
import { Postgres } from "../../src/providers/postgres";

describe('Text APIs', () => {
    let postgres: Postgres;

    beforeAll(async () => {
        postgres = await Postgres.getInstance();
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
});
