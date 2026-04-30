import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useCurrentApp } from "../context/app.context";
import { GetAccount } from "../utils/service";

SplashScreen.preventAutoHideAsync();
export default function Home_detail() {
  const { setAppState } = useCurrentApp();
  const [Logerr, setLogerr] = useState<any>();
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
        setLogerr(() => {
          throw new Error("Không thể kết nối với Back End");
        });
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    doAsyncStuff();
  }, []);

  return <></>;
}
