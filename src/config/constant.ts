import { Environment } from './environment';

const appConfig = Environment.getInstance().getAppConfig();

export const welcomeMessage: string =
  `<h1 style="text-align: center; margin: 100px;">Welcome to Text Analyzer Application! Version: ${appConfig.version} </h1>`;
