import { Action } from '../../types/action';
import { Cache } from '../../providers/cache';
import { UpdatableText, ViewableText } from '../../database/models/text';
import { Postgres } from '../../providers/postgres';
import * as TextAnalyzer from '../../utils/textAnalyzer';
import httpStatus from 'http-status';
import { ApiError } from '../../utils/apiError';

export class UpdateTextAction implements Action {
    private updatedText: string;
    private id: string;
    private userId: string;

    constructor(updatedText: string, id: string, userId: string) {
        this.updatedText = updatedText;
        this.id = id;
        this.userId = userId;
    }

    private async checkIfTextExists(id: string): Promise<boolean> {
        const postgres = await Postgres.getInstance();
        const result = await postgres.query(`SELECT * FROM texts WHERE id = '${id}' AND userId = '${this.userId}'`);
        return result.rows.length > 0;
    }

    private async calculateTextMetrics(updatedText: string): Promise<UpdatableText> {
        const cache = await Cache.getInstance();
        const cachedText = await cache.read(updatedText);
        if (cachedText) {
            return cachedText as UpdatableText;
        }
        
        return {
            text: updatedText,
            wordCount: TextAnalyzer.countWords(updatedText),
            characterCount: TextAnalyzer.countCharacters(updatedText),
            sentenceCount: TextAnalyzer.countSentences(updatedText),
            paragraphCount: TextAnalyzer.countParagraphs(updatedText),
            longestParagraphWords: TextAnalyzer.findLongestParagraphWords(updatedText),
        };
    }

    private async updateTextInDatabase(textObject: UpdatableText): Promise<ViewableText> {
        // update text in database
        const postgres = await Postgres.getInstance();
        const result = await postgres.update(
            'texts',
            textObject,
            [`id = '${this.id}'`]
        );
        const cachedText = {
            text: result.rows[0].text,
            wordCount: result.rows[0].wordcount,
            characterCount: result.rows[0].charactercount,
            sentenceCount: result.rows[0].sentencecount,
            paragraphCount: result.rows[0].paragraphcount,
            longestParagraphWords: result.rows[0].longestparagraphwords,
        }

        // store text in cache
        const cache = await Cache.getInstance();
        await cache.write(cachedText.text, cachedText);

        return {
            id: result.rows[0].id,
            userId: result.rows[0].userid,
            ...cachedText,
        };
    }

    public async execute(): Promise<ViewableText> {
        // check if text exists
        const textExists = await this.checkIfTextExists(this.id);
        if (!textExists) {
            throw new ApiError(httpStatus.NOT_FOUND, 'No text found with that id');
        }

        const updatedText = await this.calculateTextMetrics(this.updatedText);

        // update text in database
        const updatedTextObject = await this.updateTextInDatabase(updatedText);

        return updatedTextObject;
    }
}