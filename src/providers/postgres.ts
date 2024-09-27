import { Pool, PoolClient, QueryResult } from 'pg';
import { Environment } from '../config/environment';
import { ApplicationLogger } from '../utils/appLogger';

export class Postgres {
    private static instance: Postgres;
    private client: PoolClient | null = null;
    private pool: Pool;

    private constructor() {
        const pgConfig = Environment.getInstance().getPostgresConfig();
        this.pool = new Pool({
            user: pgConfig.user,
            host: pgConfig.host,
            database: pgConfig.database,
            password: pgConfig.password,
            port: pgConfig.port,
        });
    }

    public static async getInstance(): Promise<Postgres> {
        if (!Postgres.instance) {
            Postgres.instance = new Postgres();
            await Postgres.instance.connect();
        }
        return Postgres.instance;
    }

    private async connect(): Promise<void> {
        try {
            this.client = await this.pool.connect();
            await new ApplicationLogger('INFO', 'Connected to PostgreSQL database').write();
        } catch (error) {
            await new ApplicationLogger('ERROR', `Failed to connect to PostgreSQL database: ${error}`).write();
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            if (this.client) {
                this.client.release();
            }
            await this.pool.end();
            await new ApplicationLogger('INFO', 'Disconnected from PostgreSQL database').write();
        } catch (error) {
            await new ApplicationLogger('ERROR', `Error disconnecting from PostgreSQL database: ${error}`).write();
            throw error;
        }
    }

    public async isConnected(): Promise<boolean> {
        try {
            const result = await this.query('SELECT 1');
            return !!result.rowCount;
        } catch (error) {
            return false;
        }
    }

    public async query(text: string, params: any[] = []): Promise<QueryResult> {
        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            await new ApplicationLogger('ERROR', `Query error: ${error}`).write();
            throw error;
        }
    }

    public async transactionQuery(callback: (client: PoolClient) => Promise<void>): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            await callback(client);
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    public async createTable(
        table: string,
        columns: Record<string, string>,
        primaryKeys?: string[]
    ): Promise<QueryResult> {
        const columnsString = Object.entries(columns).map(([column, type]) => `${column} ${type}`).join(', ');

        const primaryKeysString = primaryKeys && primaryKeys.length > 0 ? `, PRIMARY KEY (${primaryKeys.join(', ')})` : '';
        let query = `CREATE TABLE IF NOT EXISTS ${table} (${columnsString} ${primaryKeysString})`;

        return await this.query(query);
    }

    public async insert(table: string, data: Record<string, any>): Promise<QueryResult> {
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
        return await this.query(query, values);
    }

    public async update(
        table: string,
        data: Record<string, any>,
        conditions: string[]
    ): Promise<QueryResult> {
        const setClause = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(data);
        const query = `UPDATE ${table} SET ${setClause} WHERE ${conditions.join(' AND ')} RETURNING *`;

        return await this.query(query, values);
    }

    public async delete(table: string, conditions: string[]): Promise<QueryResult> {
        const query = `DELETE FROM ${table} WHERE ${conditions.join(' AND ')} RETURNING *`;
        return await this.query(query);
    }

    public async select(
        table: string,
        columns: string[] = ['*'],
        conditions?: string[],
        orderBy?: string[],
        limit?: number,
        offset?: number
    ): Promise<QueryResult> {
        let query = `SELECT ${columns.join(', ')} FROM ${table}`;

        if (conditions && conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
        if (orderBy && orderBy.length > 0) {
            query += ` ORDER BY ${orderBy.join(', ')}`;
        }
        if (limit !== undefined && limit > 0) {
            query += ` LIMIT ${limit}`;
        }
        if (offset !== undefined && offset > 0) {
            query += ` OFFSET ${offset}`;
        }

        return await this.query(query);
    }
}
