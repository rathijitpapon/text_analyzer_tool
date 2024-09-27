const main = async () => {
    beforeAll(async () => {
        console.log('Starting tests');
    });

    afterAll(async () => {
        console.log('Tests finished');
    });
}

main();
