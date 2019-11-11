const axios = require("axios");
const config = require("src/config");
axios.defaults.withCredentials = true;

export default {
  endpointToUrl(endpoint) {
    return config.api_uri + "/" + endpoint + "/";
  },
  callEndpoint(method, endpoint, data) {
    return method(this.endpointToUrl(endpoint), data);
  },
  get(endpoint, data) {
    return this.callEndpoint(axios.get, endpoint, { params: data });
  },
  post(endpoint, data) {
    return this.callEndpoint(axios.post, endpoint, data);
  },
  put(endpoint, data) {
    return this.callEndpoint(axios.put, endpoint, data);
  },
  delete(endpoint, data) {
    return this.callEndpoint(axios.delete, endpoint, { data });
  }
};
