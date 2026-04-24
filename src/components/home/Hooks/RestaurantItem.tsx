import { APP_COLOR } from "@/src/utils/APP_COLOR";

import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Các hằng số kích thước dựa trên code cũ của bạn
const ITEM_WIDTH = 130;
const ITEM_GAP = 5;
const FULL_ITEM_SIZE = ITEM_WIDTH + ITEM_GAP; // 135

// --- TÁCH RENDER ITEM THÀNH COMPONENT RIÊNG ĐỂ CHẠY ANIMATION ---
const AnimatedRestaurantItem = ({
  item,
  index,
  scrollX,
  baseImg,
}: {
  item: IRestaurant;
  index: number;
  scrollX: Animated.SharedValue<number>;
  baseImg: string;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Vị trí tuyệt đối của phần tử này trong danh sách
    const itemPosition = index * FULL_ITEM_SIZE;

    // Công thức tính mờ dần ở 2 mép màn hình
    const opacity = interpolate(
      scrollX.value,
      [
        itemPosition - SCREEN_WIDTH, // Phần tử ở ngoài cùng bên phải (chuẩn bị vào) -> Mờ
        itemPosition - SCREEN_WIDTH + ITEM_WIDTH, // Phần tử đã vào hẳn bên trong màn hình từ mép phải -> Rõ
        itemPosition, // Phần tử chạm mép trái màn hình -> Rõ
        itemPosition + ITEM_WIDTH, // Phần tử bị vuốt khuất hẳn sang trái -> Mờ
      ],
      [0.3, 1, 1, 0.3], // Mức độ Opacity tương ứng
      Extrapolation.CLAMP,
    );

    // Công thức tính thu nhỏ ở 2 mép màn hình (Tuỳ chọn: giúp list sinh động hơn)
    const scale = interpolate(
      scrollX.value,
      [
        itemPosition - SCREEN_WIDTH,
        itemPosition - SCREEN_WIDTH + ITEM_WIDTH,
        itemPosition,
        itemPosition + ITEM_WIDTH,
      ],
      [1, 1, 1, 1], // Mức độ Scale tương ứng
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Pressable
      onPress={() =>
        router.navigate({
          pathname: "/product/[id]",
          params: { id: item._id },
        })
      }
      style={{ borderWidth: 1, borderColor: "red" }}
    >
      <Animated.View
        style={[
          { backgroundColor: "#efefef", width: ITEM_WIDTH },
          animatedStyle,
        ]}
      >
        <Image
          style={{ height: 130, width: "100%", resizeMode: "cover" }}
          source={`${baseImg}/${item.image}`}
        />
        <View style={{ padding: 5 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontWeight: "bold", maxWidth: ITEM_WIDTH }}
          >
            {item.name}
          </Text>
          <View style={styles.sale}>
            <Text style={{ color: APP_COLOR.ORANGE }}>Flash Sale</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

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

export default AnimatedRestaurantItem;
