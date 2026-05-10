import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { useCurrentApp } from "@/src/context/app.context";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
export default function TabLayout() {
  const { appState } = useCurrentApp();
  const BaseImage = appState?.user.avatar;
  console.log(appState);
  const GetIcon = (routeName: string, focused: boolean, size: number) => {
    if (routeName === "index") {
      return (
        <IconSymbol
          size={size}
          name="house.fill"
          color={focused ? APP_COLOR.ORANGE : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "order") {
      return (
        <MaterialIcons
          name="list-alt"
          size={size}
          color={focused ? APP_COLOR.ORANGE : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "favorite") {
      return (
        <MaterialIcons
          name="favorite"
          size={size}
          color={focused ? APP_COLOR.ORANGE : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "messages") {
      return (
        <AntDesign
          name="message"
          size={size}
          color={focused ? APP_COLOR.ORANGE : APP_COLOR.GRAY}
        />
      );
    }
    if (routeName === "account") {
      return (
        <MaterialCommunityIcons
          name="account"
          size={size}
          color={focused ? APP_COLOR.ORANGE : APP_COLOR.GRAY}
        />
      );
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          return GetIcon(route.name, focused, size);
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabelStyle: { paddingBottom: 3 },
          tabBarActiveTintColor: APP_COLOR.ORANGE,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          headerTitle: "Đơn Hàng",
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          headerTitle: "Tin Nhắn",
          headerStyle: {
            backgroundColor: "#ff3b30",
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerTitle: "Tài Khoản",
          headerStyle: {
            backgroundColor: "#ff3b30",
          },
          headerTitleContainerStyle: {
            paddingBottom: 10,
          },
          headerTintColor: "#fff",
          headerLeft: () => (
            <View
              style={{
                marginLeft: 12,
                paddingHorizontal: 5,
                paddingBottom: 10,
              }}
            >
              <Image
                source={{
                  uri: `${BaseImage}`,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
