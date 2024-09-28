import { Environment } from './environment';

const appConfig = Environment.getInstance().getAppConfig();

export const rateLimitConfig = {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again in 5 minutes!',
};

export const welcomeMessage: string =
  `<h1 style="text-align: center; margin: 100px;">Welcome to Text Analyzer Application! Version: ${appConfig.version} </h1>`;
