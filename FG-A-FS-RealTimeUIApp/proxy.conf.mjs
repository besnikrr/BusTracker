let target = "https://i4ms7h0mfj.execute-api.us-east-1.amazonaws.com/dev";
if (process.env.USE_LOCAL_API === "true") {
  target = "http://localhost:3000/dev"
}

export default [
  {
    context: [
        "/auth/user/profile",
        "/locations/businessUnits/all",
        "/persons/driver/search",
        "/places/search",
    ],
    target,
    secure: true,
    changeOrigin: true,
  },
  {
    context: [
        "/tasks/**",
        "/vehicles/**",
    ],
    target,
    secure: true,
    changeOrigin: true,
  },
];
