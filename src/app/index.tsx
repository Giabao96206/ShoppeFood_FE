import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useCurrentApp } from "../context/app.context";
import { GetAccount } from "../utils/service";

SplashScreen.preventAutoHideAsync();
export default function Home_detail() {
  const { setAppState } = useCurrentApp();
  useEffect(() => {
    async function doAsyncStuff() {
      try {
        const acc = await GetAccount();
        if (acc.data) {
          console.log(acc.data);
          router.replace("/(tabs)");

          setAppState({
            user: acc.data.user,
            access_token: await AsyncStorage.getItem("access_token"),
          });
        } else {
          router.replace("/(auth)/welcome");
        }
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    doAsyncStuff();
  }, []);

  return <></>;
}
