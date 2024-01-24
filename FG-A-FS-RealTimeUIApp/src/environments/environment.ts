export const environment = {
  name: "<env-name>",
  production: false,
  api: {
    adb: "<endpoint>",
  },
  auth: {
    provider: "<auth-provider>",
  },
  map: {
    apiKey: "<api-key>",
    padding: 100,
    defaultZoom: 0,
    focusZoom: 0,
  },
  search: {
    minCharacters: 0,
  },
  polling: {
    interval: 5000,
    // for re-request if server is down or error the polling interval will be used
    attempts: 1,
    // stop polling when browser inactive
    backgroundPolling: false,
  },
};
