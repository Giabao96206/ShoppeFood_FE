import AppProvider from "@/src/context/app.context";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "transparent" },
  };

  return (
    <RootSiblingParent>
      <ThemeProvider value={navTheme}>
        <AppProvider>
          {/* <SafeAreaView style={{ flex: 1 }}> */}
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/SignUp"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/verify"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/welcome"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(user)/Home"
              options={{
                title: "Trang chu",
              }}
            />
            <Stack.Screen
              name="product/index"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="product/[id]"
              options={{ headerShown: false }}
            />
          </Stack>
          <StatusBar style="auto" />
          {/* </SafeAreaView> */}
        </AppProvider>
      </ThemeProvider>
    </RootSiblingParent>
  );
}

/*
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="Home" />
        <Stack.Screen name="Home_Detail" options={{ title: "Detail" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

*/
