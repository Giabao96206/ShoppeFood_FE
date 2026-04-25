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
  const url = "/login";
  return axios.post<IBackendRes<UserLogin>>(url, { email, password });
};

export const GetAccount = () => {
  const url = "/account";
  return axios.get<IBackendRes<UserLogin>>(url);
};

export const GetTopRestaurant = (ref: string) => {
  const url = `/${ref}`;
  return axios.get<IBackendRes<IRestaurant[]>>(url);
};

export const GetMenuRes = (id: string) => {
  const url = `/menu/${id}`;
  return axios.get<IBackendRes<IMenuRestaurant>>(url);
};
export const printAsyncStorage = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys!, (error, stores) => {
      let asyncStorage: any = {};
      stores?.map((result, i, store) => {
        asyncStorage[store[i][0]] = store[i][1];
      });
    });
  });
};

export const processDataRestaurantMenu = (
  restaurant: IMenuRestaurant | null,
) => {
  if (!restaurant) return [];
  return restaurant?.menus?.map((menu, index) => {
    return {
      index,
      key: menu._id,
      title: menu.title,
      data: menu.menuItems,
    };
  });
};

export const currencyFormatter = (value: any) => {
  const options = {
    significantDigits: 2,
    thousandsSeparator: ".",
    decimalSeparator: ",",
    symbol: "đ",
  };
  if (typeof value !== "number") value = 0.0;
  value = value.toFixed(options.significantDigits);
  const [currency, decimal] = value.split(".");
  return `${currency.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    options.thousandsSeparator,
  )} ${options.symbol}`;
};
