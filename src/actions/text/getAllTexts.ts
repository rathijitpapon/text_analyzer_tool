import { Action } from '../../types/action';
import { ViewableText } from '../../database/models/text';
import { Postgres } from '../../providers/postgres';

export class GetAllTextsAction implements Action {
    constructor() {}

    private async findTexts(): Promise<ViewableText[]> {
        const postgres = await Postgres.getInstance();
        const result = await postgres.query(`SELECT * FROM texts`);
        
        const texts = result.rows.map((row) => ({
            id: row.id,
            text: row.text,
            wordCount: row.wordcount,
            characterCount: row.charactercount,
            sentenceCount: row.sentencecount,
            paragraphCount: row.paragraphcount,
            longestParagraphWords: row.longestparagraphwords,
        }));

        return texts;
    }

    public async execute(): Promise<ViewableText[]> {
        const texts = await this.findTexts();
        return texts;
    }
}