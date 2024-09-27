import dotenv from 'dotenv';
dotenv.config();

import { ExpressApplication } from "./providers/expressApp";
import { Cache } from './providers/cache';
import { Environment } from "./config/environment";
import { ApplicationLogger } from "./utils/appLogger";

const main = async () => {
    const appConfig = Environment.getInstance().getAppConfig();
    const app = await ExpressApplication.configure();

    app.listen(appConfig.port, async () => {
        await Cache.getInstance();

        await new ApplicationLogger('INFO', `Application is running on port: ${appConfig.port}`).write();
    });
}

main();