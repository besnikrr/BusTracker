export const environment = {
  name: "dev",
  production: false,
  api: {
    adb: "https://i4ms7h0mfj.execute-api.us-east-1.amazonaws.com/dev",
  },
  auth: {
    provider: "fg-rtblrr-cognito-AzureAD-dev",
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
