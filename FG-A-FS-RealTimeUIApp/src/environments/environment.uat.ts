export const environment = {
  name: "uat",
  production: false,
  api: {
    adb: "https://tv340mbd0m.execute-api.us-east-1.amazonaws.com/uat",
  },
  auth: {
    provider: "fg-rtblrr-cognito-AzureAD-uat",
  },
  map: {
    apiKey: "C0830AD82BBDDE439A21D756B8BEAFB2",
    padding: 100,
    defaultZoom: 0,
    focusZoom: 7.5,
  },
  search: {
    minCharacters: 2,
  },
  polling: {
    interval: 5000,
    // for re-request if server is down or error the polling interval will be used
    attempts: 1,
    // stop polling when browser inactive
    backgroundPolling: false,
  },
};
