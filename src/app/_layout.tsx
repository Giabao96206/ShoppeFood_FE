import AppProvider from "@/src/context/app.context";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 10, gap: 15 }}>
        <View
          style={{
            backgroundColor: "#333",
            padding: 10,
            borderRadius: 3,
            gap: 10,
          }}
        >
          <Text style={{ color: "red", fontSize: 20 }}>
            Something went wrong
          </Text>
          <Text style={{ color: "#fff" }}>{error.message}</Text>
        </View>
        <Button title="Try Again ?" onPress={retry} />
      </View>
    </SafeAreaView>
  );
}
export default function RootLayout() {
  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "white" },
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

            <Stack.Screen
              name="product/create.modal"
              options={{
                headerShown: false,
                presentation: "transparentModal",
                animation: "fade",
                animationDuration: 200,
              }}
            />
            <Stack.Screen
              name="product/update.modal"
              options={{
                headerShown: false,
                presentation: "transparentModal",
                animation: "fade",
                animationDuration: 200,
              }}
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
