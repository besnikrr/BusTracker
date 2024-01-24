import { Amplify } from "aws-amplify";
import awsconfig from "src/aws-exports";

import { environment } from "src/environments/environment";

interface AppConfig {
  configure(): void;
}

interface AuthConfig {
  provider: string;
}

interface MapConfig {
  apiKey: string;
  padding: number;
  defaultZoom: number;
  focusZoom: number;
}

interface SearchConfig {
  minCharacters: number;
}

interface PollingConfig {
  interval: number;
  attempts: number;
  backgroundPolling: boolean;
}

export const enum Api {
  ADB = "adb",
}

class AppConfigClass implements AppConfig {
  configure() {
    awsconfig.oauth.redirectSignIn = `${window.location.origin}/`;
    awsconfig.oauth.redirectSignOut = `${window.location.origin}/`;

    Amplify.configure({
      ...awsconfig,
      API: {
        endpoints: [{ name: Api.ADB, endpoint: environment.api[Api.ADB] }],
      },
    });
  }
}

export const AppConfig = new AppConfigClass();
export const authConfig: AuthConfig = environment.auth;
export const mapConfig: MapConfig = environment.map;
export const searchConfig: SearchConfig = environment.search;
export const pollingConfig: PollingConfig = environment.polling;
