import { Action } from '../../types/action';
import { Postgres } from '../../providers/postgres';
import httpStatus from 'http-status';
import { ApiError } from '../../utils/apiError';

export class DeleteTextAction implements Action {
    private id: string;
    private userId: string;

    constructor(id: string, userId: string) {
        this.id = id;
        this.userId = userId;
    }
    
    private async checkIfTextExists(id: string): Promise<boolean> {
        const postgres = await Postgres.getInstance();
        const result = await postgres.query(`SELECT * FROM texts WHERE id = '${id}' AND userId = '${this.userId}'`);
        return result.rows.length > 0;
    }

    private async removeTextFromDatabase(id: string): Promise<void> {
        const postgres = await Postgres.getInstance();
        await postgres.query(`DELETE FROM texts WHERE id = '${id}'`);
    }

    public async execute(): Promise<void> {
        const exists = await this.checkIfTextExists(this.id);
        if (!exists) {
            throw new ApiError(httpStatus.NOT_FOUND, 'No text found with that id');
        }

        await this.removeTextFromDatabase(this.id);
    }
}