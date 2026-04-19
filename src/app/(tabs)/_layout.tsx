import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
export default function TabLayout() {
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
    if (routeName === "notification") {
      return (
        <MaterialIcons
          name="notifications"
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
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
