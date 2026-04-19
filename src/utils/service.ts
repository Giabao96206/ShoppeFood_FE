import axios from "@/src/utils/axios.customine";

export const register = (email: string, password: string, name: string) => {
  const url = "/register";
  return axios.post<IBackendRes<IRegister>>(url, { email, password, name });
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
  return axios.post<IBackendRes<IRegister>>(url, { email, password });
};
