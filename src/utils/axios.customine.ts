import AsyncStorage from "@react-native-async-storage/async-storage";
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
  async function (config) {
    const access_token = await AsyncStorage.getItem("access_token");
    config.headers["Authorization"] = `Bearer ${access_token}`;
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
