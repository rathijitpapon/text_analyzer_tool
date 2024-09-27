import { Postgres } from '../providers/postgres';
import { createTextTable } from './models/text';
import { ApplicationLogger } from '../utils/appLogger';

const setupDatabase = async (): Promise<void> => {
    try {
        const postgres = await Postgres.getInstance();

        const query = `
            create extension if not exists "uuid-ossp";

            create or replace function set_updated_at()
                returns trigger as
            $$
            begin
                NEW.updated_at = now();
            return NEW;
            end;
            $$ language plpgsql;

            create or replace function trigger_updated_at(tablename regclass)
                returns void as
            $$
            begin
            execute format('CREATE TRIGGER set_updated_at
                    BEFORE UPDATE
                    ON %s
                    FOR EACH ROW
                    WHEN (OLD is distinct from NEW)
                EXECUTE FUNCTION set_updated_at();', tablename);
            end;
            $$ language plpgsql;

            create collation if not exists case_insensitive (provider = icu, locale = 'und-u-ks-level2', deterministic = false);
        `;

        await postgres.query(query);
    } catch (error) {
        await new ApplicationLogger('ERROR', `Failed to initialize database tables: ${error}`).write();
        throw error;
    }
};

export async function setupDatabaseTables(): Promise<void> {
    try {
        await setupDatabase();
        await createTextTable();

        await new ApplicationLogger('INFO', 'Database tables initialized successfully').write();
    } catch (error) {
        await new ApplicationLogger('ERROR', `Failed to initialize database tables: ${error}`).write();
        throw error;
    }
}
