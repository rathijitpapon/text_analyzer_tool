import { createClient, RedisClientType } from 'redis';
import { Environment } from '../config/environment';
import { ApplicationLogger } from '../utils/appLogger';

export class Cache {
    private static instance: Cache;
    private redisConfig = Environment.getInstance().getRedisConfig();
    private client!: RedisClientType;

    private constructor() {}

    private async connect() {
        if (this.redisConfig.url.includes('localhost')) {
            this.client = createClient({
                url: this.redisConfig.url,
            });
        } else {
            this.client = createClient({
                url: this.redisConfig.url,
                password: this.redisConfig.password,
            });
        }
        await this.client.connect();
        
        await new ApplicationLogger('INFO', `Connected to Redis`).write();

        this.client.on('error', async (error) => {
            await new ApplicationLogger('ERROR', `Unable to connect to Redis. ${error.message}`).write();
        });
    }

    public static async getInstance(): Promise<Cache> {
        if (!Cache.instance) {
            Cache.instance = new Cache();
            await Cache.instance.connect();
        }

        return Cache.instance;
    }

    public async write(
        key: string,
        value: Object,
        expirationInMinutes: number = this.redisConfig.defaultExpirationInMinutes
    ): Promise<void> {
        await this.client.set(key, JSON.stringify(value), {
            EX: expirationInMinutes * 60,
        });
    }

    public async read(key: string): Promise<Object | null> {
        const value = await this.client.get(key);

        if (!value) {
            return null;
        }
        return JSON.parse(value);
    }

    public async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async exists(key: string): Promise<Boolean> {
        return await this.client.exists(key) === 1;
    }
}
