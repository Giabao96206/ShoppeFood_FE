import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "expo-image";
import AppProvider, { useCurrentApp } from "../context/app.context";

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

function RootLayoutNav() {
  const { userSend, appState } = useCurrentApp();
  // socket(appState?.user._id);
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />

        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="(auth)/verify" options={{ headerShown: false }} />

        <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />

        <Stack.Screen
          name="(user)/product/index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(user)/product/[id]"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(user)/product/create.modal"
          options={{
            headerShown: false,
            presentation: "transparentModal",
            animation: "fade",
            animationDuration: 200,
          }}
        />

        <Stack.Screen
          name="(user)/product/update.modal"
          options={{
            headerShown: false,
            presentation: "transparentModal",
            animation: "fade",
            animationDuration: 200,
          }}
        />

        <Stack.Screen
          name="(user)/product/orderLast"
          options={{
            title: "Xác nhận đơn hàng",
            presentation: "transparentModal",
            animation: "fade",
            animationDuration: 200,
          }}
        />

        <Stack.Screen
          name="(user)/account/info"
          options={{
            title: "Thông tin tài khoản",
          }}
        />

        <Stack.Screen
          name="(user)/message/SendMessage"
          options={{
            headerTitle: () => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Avatar */}
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 999,
                    backgroundColor: "#ddd",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  {userSend?.avatar ? (
                    <Image
                      source={{ uri: userSend.avatar }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      {userSend?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  )}
                </View>

                {/* Name + status */}
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#111",
                    }}
                  >
                    {userSend?.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: "green",
                    }}
                  >
                    Online
                  </Text>
                </View>
              </View>
            ),

            headerShadowVisible: false,

            headerStyle: {
              backgroundColor: "#fff",
            },
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  return (
    <RootSiblingParent>
      <ThemeProvider value={navTheme}>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </ThemeProvider>
    </RootSiblingParent>
  );
}
