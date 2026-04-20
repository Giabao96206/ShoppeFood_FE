import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  theme: string;
  setTheme: (v: string) => void;
  appState: UserLogin | null;
  setAppState: (v: any) => void;
}
const AppContext = createContext<AppContextType | null>(null);

export const useCurrentApp = () => {
  const currentTheme = useContext(AppContext);
  if (!currentTheme) {
    throw new Error("useCurrentApp must be used within a AppProvider");
  }
  return currentTheme;
};

interface IProps {
  children: React.ReactNode;
}
const AppProvider = (props: IProps) => {
  const [theme, setTheme] = useState<string>("BaoLight");
  const [appState, setAppState] = useState<UserLogin | null>(null);
  return (
    <AppContext.Provider value={{ theme, setTheme, appState, setAppState }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
