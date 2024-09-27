import { Postgres } from "../../src/providers/postgres";

describe('Postgres Database', () => {
    let postgres: Postgres;

    beforeAll(async () => {
        postgres = await Postgres.getInstance();
    });

    const createTestTable = async () => {
        const result = await postgres.createTable(
            'test_table',
            {
                id: 'INTEGER',
                name: 'VARCHAR(255)',
                created_at: 'TIMESTAMP',
            },
            ['id'],
        );

        return result;
    };

    const dropTestTable = async () => {
        const result = await postgres.query('DROP TABLE IF EXISTS test_table');
        return result;
    };

    const insertTestData = async () => {
        const result = await postgres.insert(
            'test_table',
            {
                id: 1,
                name: 'Test Name',
                created_at: new Date(),
            },
        );

        return result;
    };

    beforeEach(async () => {
        await createTestTable();
    });

    afterEach(async () => {
        await dropTestTable();
    });

    it('should connect to the database', async () => {
        expect(postgres).toBeDefined();
        expect(postgres.isConnected()).toBeTruthy();
    });

    it('should query the database', async () => {
        const result = await postgres.query('SELECT 1');
        expect(result.rows.length).toBe(1);
    });

    it('should create a new table', async () => {
        const tableExists = await postgres.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_table')");
        expect(tableExists.rowCount).toBe(1);
    });

    it('should drop a table', async () => {
        await dropTestTable();

        try {
            await postgres.query("SELECT EXISTS (SELECT 1 FROM test_table)");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }

        await createTestTable();
    });

    it('should insert a new row into the table', async () => {
        const insertResult = await insertTestData();
        expect(insertResult.rowCount).toBe(1);
    });

    it('should update a row in the table', async () => {
        await insertTestData();

        const updateResult = await postgres.update(
            'test_table',
            { name: 'Updated Name' },
            ['id = 1'],
        );
        expect(updateResult.rowCount).toBe(1);

        const selectResult = await postgres.query('SELECT * FROM test_table WHERE id = 1');
        expect(selectResult.rows[0].name).toBe('Updated Name');
    });

    it('should delete a row from the table', async () => {
        await insertTestData();

        const deleteResult = await postgres.delete(
            'test_table',
            ['id = 1'],
        );
        expect(deleteResult.rowCount).toBe(1);

        const selectResult = await postgres.query('SELECT * FROM test_table WHERE id = 1');
        expect(selectResult.rows.length).toBe(0);
    });

    it('should select a row from the table', async () => {
        await insertTestData();

        const selectResult = await postgres.select(
            'test_table',
            ['name'],
            ['id = 1'],
            ['created_at'],
            1,
             0,
        );
        expect(selectResult.rows.length).toBe(1);
        expect(selectResult.rows[0].name).toBe('Test Name');
    });
});