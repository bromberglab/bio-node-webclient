export default {
  debounceDefault: 500,
  prod: process.env.NODE_ENV === "production",
  apiUri:
    process.env.NODE_ENV === "production"
      ? "/api/v1"
      : "http://localhost:8000/api/v1",
  reteId: "bio-node@1.0.0",
  reteVersion: 1
};
