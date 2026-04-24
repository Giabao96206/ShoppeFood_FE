import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { GetTopRestaurant } from "@/src/utils/service";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import RestaurantItem from "./Hooks/RestaurantItem";

interface IProps {
  name: string;
  description: string;
  refAPI: string;
}

export default function CollectionHome(props: IProps) {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  const { name, description, refAPI } = props;
  const [restaurant, setRestaurant] = useState<IRestaurant[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await GetTopRestaurant(refAPI);
      if (res.data) {
        setRestaurant(res.data);
      } else {
        console.log(res.message);
      }
    };
    fetchData();
  }, [refAPI]);
  const baseImg = `${process.env.EXPO_PUBLIC_API_URL}/images/restaurant`;
  return (
    <>
      <View style={{ height: 10, backgroundColor: "#e9e9e9" }}> </View>
      <View style={styles.container}>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text
            style={{
              color: APP_COLOR.ORANGE,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {name}
          </Text>
          <Text style={{ color: "#5a5a5a" }}>Xem tất cả</Text>
        </View>
        <View style={{ marginVertical: 5 }}>
          <Text style={{ color: "#5a5a5a" }}>{description}</Text>
        </View>
        <Animated.FlatList
          data={restaurant}
          horizontal
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ gap: 5 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RestaurantItem
              item={item}
              index={index}
              scrollX={scrollX}
              baseImg={baseImg}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sale: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: APP_COLOR.ORANGE,
    padding: 3,
    borderRadius: 3,
    alignSelf: "flex-start",
  },
});
