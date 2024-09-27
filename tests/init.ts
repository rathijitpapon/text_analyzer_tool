import { Postgres } from "../src/providers/postgres";

const main = async () => {
    beforeAll(async () => {
        await Postgres.getInstance();
    });

    afterAll(async () => {
        const postgres = await Postgres.getInstance();
        await postgres.disconnect();
    });
}

main();
