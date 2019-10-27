module.exports = {
  debounceDefault: 500,
  api_uri:
    process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000/api"
};
