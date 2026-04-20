import axios from "@/src/utils/axios.customine";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const register = (name: string, email: string, password: string) => {
  const url = "/register";
  return axios.post<IBackendRes<IRegister>>(url, { name, email, password });
};

export const verifycode = (email: string, code: string) => {
  const url = "/activateAccount";
  return axios.post<IBackendRes<IRegister>>(url, { email, code });
};

export const resendcode = (email: string) => {
  const url = "/ReSendCode";
  return axios.post<IBackendRes<IRegister>>(url, { email });
};

export const LoginAccount = (email: string, password: string) => {
  console.log(email, password);
  const url = "/login";
  return axios.post<IBackendRes<UserLogin>>(url, { email, password });
};

export const GetAccount = () => {
  const url = "/account";
  return axios.get<IBackendRes<UserLogin>>(url);
};

export const printAsyncStorage = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys!, (error, stores) => {
      let asyncStorage: any = {};
      stores?.map((result, i, store) => {
        asyncStorage[store[i][0]] = store[i][1];
      });
      console.log(JSON.stringify(asyncStorage, null, 2));
    });
  });
};
