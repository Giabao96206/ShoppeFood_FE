import RMain from "@/src/components/example/restaurant/main";
import { GetMenuRes } from "@/src/utils/service";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function Product() {
  const { id } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<IMenuRestaurant | null>(null);
  useEffect(() => {
    const fetch = async () => {
      const res = await GetMenuRes(id as string);
      if (res.data) {
        setRestaurant(res.data);
      }
    };

    fetch();
  }, [id]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <RMain restaurant={restaurant} />
      </View>
    </>
  );
}
