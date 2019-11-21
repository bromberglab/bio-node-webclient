export default {
  debounceDefault: 500,
  apiUri:
    process.env.NODE_ENV === "production"
      ? "/api/v1"
      : "http://localhost:8000/v1",
  reteId: "bio-node@1.0.0",
  reteVersion: 1
};
