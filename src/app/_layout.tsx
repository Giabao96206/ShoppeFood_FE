import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "expo-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ChatBoxAI from "../components/AI/ChatBoxAI";
import AppProvider, { useCurrentApp } from "../context/app.context";
import AlerSocket from "./socket.aler";
import { usePushNotification } from "./usePushNotification";

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
  const { userSend, appState, lastMessgae } = useCurrentApp();
  usePushNotification(appState?.user._id || null);

  const realTimeUser =
    (lastMessgae || []).find((item) => item?.otherUser?._id === userSend?._id)
      ?.otherUser || userSend;

  const isOtherUserOnline = realTimeUser?.is_online;

  const getLastSeenText = (date: Date | string) => {
    if (!date) return "";
    const lastSeen = new Date(date);
    const now = new Date();

    const diffMs = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Vừa mới truy cập";
    if (minutes < 60) return `Hoạt động ${minutes} phút trước`;
    if (hours < 24) return `Hoạt động ${hours} giờ trước`;
    return `Hoạt động ${days} ngày trước`;
  };

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
          options={{ title: "Thông tin tài khoản" }}
        />

        <Stack.Screen
          name="(user)/message/SendMessage"
          options={{
            headerTitle: () => (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
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
                  {realTimeUser?.avatar ? (
                    <Image
                      source={{ uri: realTimeUser.avatar }}
                      style={{ width: "100%", height: "100%" }}
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
                      {realTimeUser?.name?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  )}
                  {/* Bổ sung luôn chấm xanh lên Header cho đồng bộ UI */}
                  {isOtherUserOnline && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#31A24C",
                        borderWidth: 2,
                        borderColor: "#FFFFFF",
                      }}
                    />
                  )}
                </View>

                {/* Name + status */}
                <View>
                  <Text
                    style={{ fontSize: 16, fontWeight: "600", color: "#111" }}
                  >
                    {realTimeUser?.name}
                  </Text>

                  {/* 👇 FIX 2: Màu sắc phụ thuộc vào trạng thái Online */}
                  <Text
                    style={{
                      fontSize: 12,
                      color: isOtherUserOnline ? "#31A24C" : "#65676B",
                      fontWeight: isOtherUserOnline ? "500" : "normal",
                    }}
                  >
                    {isOtherUserOnline
                      ? "Đang hoạt động"
                      : getLastSeenText(realTimeUser?.last_seen)}
                  </Text>
                </View>
              </View>
            ),
            headerShadowVisible: false,
            headerStyle: { backgroundColor: "#fff" },
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <ThemeProvider value={navTheme}>
          <AppProvider>
            <ChatBoxAI />
            <AlerSocket />
            <RootLayoutNav />
          </AppProvider>
        </ThemeProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}
