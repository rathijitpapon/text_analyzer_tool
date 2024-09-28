import { Action } from '../../types/action';
import { ViewableText } from '../../database/models/text';
import { Postgres } from '../../providers/postgres';

export class GetAllTextsAction implements Action {
    private userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }

    private async findTexts(): Promise<ViewableText[]> {
        const postgres = await Postgres.getInstance();
        const result = await postgres.query(`SELECT * FROM texts WHERE userId = '${this.userId}'`);
        
        const texts = result.rows.map((row) => ({
            id: row.id,
            userId: row.userid,
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