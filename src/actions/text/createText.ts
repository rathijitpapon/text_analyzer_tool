import { Action } from '../../types/action';
import { Cache } from '../../providers/cache';
import { CreatableText, ViewableText } from '../../database/models/text';
import { Postgres } from '../../providers/postgres';
import * as TextAnalyzer from '../../utils/textAnalyzer';

export class CreateNewTextAction implements Action {
    private text: string;

    constructor(text: string) {
        this.text = text;
    }

    private async calculateTextMetrics(text: string): Promise<CreatableText> {
        const cache = await Cache.getInstance();
        const cachedText = await cache.read(text);
        if (cachedText) {
            return cachedText as ViewableText;
        }
        
        return {
            text,
            wordCount: TextAnalyzer.countWords(text),
            characterCount: TextAnalyzer.countCharacters(text),
            sentenceCount: TextAnalyzer.countSentences(text),
            paragraphCount: TextAnalyzer.countParagraphs(text),
            longestParagraphWords: TextAnalyzer.findLongestParagraphWords(text),
        };
    }

    private async storeTextInDatabase(textObject: CreatableText): Promise<ViewableText> {
        // store text in database
        const postgres = await Postgres.getInstance();
        const result = await postgres.insert('texts', textObject);
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
            ...cachedText,
        };
    }

    async execute(): Promise<ViewableText> {
        const textObject = await this.calculateTextMetrics(this.text);
        
        // store text in database
        const insertedText = await this.storeTextInDatabase(textObject);

        return insertedText;
    }
}
