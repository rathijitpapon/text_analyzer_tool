import { z } from 'zod';
import { applicationModes } from '../types/application';
import { parseZodSchema } from '../utils/zod';

// Validate environment variables
const envVariablesSchema = z.object({
  NODE_ENV: z.enum(applicationModes),
  PORT: z.coerce.number().int(),
  VERSION: z.string(),
  ALLOWED_ORIGINS: z.string(),

  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_PORT: z.coerce.number().int(),
  POSTGRES_HOST: z.string(),

  JWT_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().int(),
  JWT_REFRESH_EXPIRATION_MINUTES: z.coerce.number().int(),

  REDIS_URL: z.string().url(),
  REDIS_PASSWORD: z.string(),
  REDIS_DEFAULT_EXPIRATION_IN_MINUTES: z.coerce.number().int(),
});

export class Environment {
  private static instance: Environment;
  private envVariables: z.infer<typeof envVariablesSchema>;

  private constructor() {
    // Validate environment variables
    this.envVariables = parseZodSchema(envVariablesSchema, process.env) as z.infer<typeof envVariablesSchema>;
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }

    return Environment.instance
  }

  public getAppConfig() {
    return {
      name: 'Text Analyzer Tool',
      mode: this.envVariables.NODE_ENV,
      port: this.envVariables.PORT,
      version: this.envVariables.VERSION,
      allowedOrigins: this.envVariables.ALLOWED_ORIGINS.split(','),
    };
  }

  public getPostgresConfig() {
    return {
      user: this.envVariables.POSTGRES_USER,
      password: this.envVariables.POSTGRES_PASSWORD,
      database: this.envVariables.POSTGRES_DB,
      port: this.envVariables.POSTGRES_PORT,
      host: this.envVariables.POSTGRES_HOST,
    };
  }

  public getJwtConfig() {
    return {
      secret: this.envVariables.JWT_SECRET,
      accessExpirationMinutes: this.envVariables.JWT_ACCESS_EXPIRATION_MINUTES,
      refreshExpirationMinutes: this.envVariables.JWT_REFRESH_EXPIRATION_MINUTES,
    };
  }

  public getRedisConfig() {
    return {
      url: this.envVariables.REDIS_URL,
      password: this.envVariables.REDIS_PASSWORD,
      defaultExpirationInMinutes: this.envVariables.REDIS_DEFAULT_EXPIRATION_IN_MINUTES,
    };
  }
}