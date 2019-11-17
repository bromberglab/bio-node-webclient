export default {
  debounceDefault: 500,
  apiUri:
    process.env.NODE_ENV === "production"
      ? "/api"
      : "http://localhost:8000/api",
  reteId: "bio-node@1.0.0",
  reteVersion: 1
};
