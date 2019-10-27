const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/app/" : "/",
  configureWebpack: {
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src")
      }
    }
  }
};
