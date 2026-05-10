import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  theme: string;
  setTheme: (v: string) => void;
  appState: UserLogin | null;
  setAppState: (v: any) => void;
  restaurant: IMenuRestaurant | null;
  setRestaurant: (v: any) => void;
  cart: ICart | Record<string, never>;
  setCart: (v: any) => void;
  address: string;
  setAddress: (v: string) => void;
  hasLocation: boolean;
  setHasLocation: (v: boolean) => void;
  userSend: any;
  setUserSend: (v: any) => void;
}
const AppContext = createContext<AppContextType | null>(null);

interface IProps {
  children: React.ReactNode;
}
const AppProvider = (props: IProps) => {
  const [theme, setTheme] = useState<string>("BaoLight");
  const [appState, setAppState] = useState<UserLogin | null>(null);
  const [restaurant, setRestaurant] = useState<IMenuRestaurant | null>(null);
  const [address, setAddress] = useState<string>("Đang tìm vị trí của bạn...");
  const [cart, setCart] = useState<ICart | Record<string, never>>({});
  const [hasLocation, setHasLocation] = useState<boolean>(false);
  const [userSend, setUserSend] = useState<any>("");
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        appState,
        setAppState,
        cart,
        setCart,
        restaurant,
        setRestaurant,
        address,
        setAddress,
        hasLocation,
        setHasLocation,
        userSend,
        setUserSend,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useCurrentApp = () => {
  const currentTheme = useContext(AppContext);
  if (!currentTheme) {
    throw new Error("useCurrentApp must be used within a AppProvider");
  }
  return currentTheme;
};

export default AppProvider;
