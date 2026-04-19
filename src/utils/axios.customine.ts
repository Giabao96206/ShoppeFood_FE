import axios from "axios";

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
});
export default instance;

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before the request is sent
    return config;
  },
  function (error) {
    // Do something with the request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.data) return response.data;
    return response;
  },
  function (error) {
    if (error?.response?.data) {
      return error.response.data;
    }

    return Promise.reject(error);
  },
);
