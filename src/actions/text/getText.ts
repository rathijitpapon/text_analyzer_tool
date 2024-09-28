import { Action } from '../../types/action';
import { ViewableText } from '../../database/models/text';
import { Postgres } from '../../providers/postgres';
import httpStatus from 'http-status';
import { ApiError } from '../../utils/apiError';

export class GetTextAction implements Action {
    private id: string;

    constructor(id: string) {
        this.id = id;
    }

    private async findText(id: string): Promise<ViewableText | null> {
        const postgres = await Postgres.getInstance();
        const result = await postgres.query(`SELECT * FROM texts WHERE id = '${id}'`);
        
        if (result.rows.length === 0) {
            return null;
        }

        return {
            id: result.rows[0].id,
            text: result.rows[0].text,
            wordCount: result.rows[0].wordcount,
            characterCount: result.rows[0].charactercount,
            sentenceCount: result.rows[0].sentencecount,
            paragraphCount: result.rows[0].paragraphcount,
            longestParagraphWords: result.rows[0].longestparagraphwords,
        }
    }

    public async execute(): Promise<ViewableText> {
        const textObject = await this.findText(this.id);

        // check if text exists
        if (!textObject) {
            throw new ApiError(httpStatus.NOT_FOUND, 'No text found with that id');
        }

        return textObject;
    }
}