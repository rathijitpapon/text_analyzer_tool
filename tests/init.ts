import { Postgres } from "../src/providers/postgres";
import { setupDatabaseTables } from "../src/database/setupDatabase";   

const main = async () => {
    beforeAll(async () => {
        await Postgres.getInstance();
        await setupDatabaseTables();
    });

    afterAll(async () => {
        const postgres = await Postgres.getInstance();
        await postgres.disconnect();
    });
}

main();
