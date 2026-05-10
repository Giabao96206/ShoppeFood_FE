import { useCurrentApp } from "@/src/context/app.context";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { currencyFormatter } from "@/src/utils/service";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

interface IUpdateItems {
  image: string;
  title: string;
  option: string;
  price: number;
  quantity: number;
}

const UpdateModal = () => {
  const { restaurant, cart, setCart } = useCurrentApp();
  const { menuItemId } = useLocalSearchParams();

  const [menuItem, setMenuItem] = useState<IMenuItems | null>(null);
  const [updatedItems, setUpdatedItems] = useState<IUpdateItems[]>([]);

  useEffect(() => {
    if (!restaurant || !menuItemId) return;

    const foundItem = restaurant.menus
      .flatMap((menu) => menu.menuItems)
      .find((item) => item._id === menuItemId);

    if (foundItem) {
      setMenuItem(foundItem);
    }
  }, [restaurant, menuItemId]);

  useEffect(() => {
    if (!restaurant || !menuItem) return;

    const currentItem = cart?.[restaurant._id]?.items?.[menuItem._id];
    if (!currentItem?.extra) return;

    const result: IUpdateItems[] = Object.entries(currentItem.extra).map(
      ([key, value]) => {
        const option = menuItem.options?.find(
          (item) => `${item.title}-${item.description}` === key,
        );

        return {
          image: menuItem.image,
          title: menuItem.title,
          option: key,
          price: option?.additionalPrice || 0,
          quantity: value as number,
        };
      },
    );

    setUpdatedItems(result);
  }, [menuItem, restaurant, cart]);

  const updateCart = (
    total: number,
    keyOption: string,
    optionPrice: number,
    shouldDeleteItem: boolean,
  ) => {
    if (!restaurant || !menuItem) return;

    setCart((prevCart: any) => {
      const newCart = structuredClone(prevCart);
      const restaurantCart = newCart[restaurant._id];
      const currentItem = restaurantCart.items[menuItem._id];

      const itemPrice = menuItem.basePrice + optionPrice;

      restaurantCart.sum += total * itemPrice;
      restaurantCart.quantity += total;
      currentItem.quantity += total;

      if (currentItem.extra?.[keyOption] != null) {
        currentItem.extra[keyOption] += total;

        if (currentItem.extra[keyOption] <= 0) {
          delete currentItem.extra[keyOption];
        }

        if (shouldDeleteItem || Object.keys(currentItem.extra).length === 0) {
          delete restaurantCart.items[menuItem._id];
        }
      }

      return newCart;
    });
  };
  const handlePressItem = (item: IUpdateItems, action: "MINUS" | "PLUS") => {
    const delta = action === "MINUS" ? -1 : 1;

    setUpdatedItems((prev) => {
      const next = prev
        .map((i) =>
          i.option === item.option ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0);

      updateCart(delta, item.option, item.price, next.length === 0);

      if (next.length === 0) {
        router.back();
      }

      return next;
    });
  };
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => router.back()}
      />

      <Animated.View
        entering={SlideInDown}
        style={{
          height: "60%",
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Chỉnh sửa số lượng
            </Text>
          </View>

          <AntDesign
            name="close"
            size={24}
            color="grey"
            onPress={() => router.back()}
          />
        </View>

        <ScrollView style={{ flex: 1 }}>
          {updatedItems.map((item) => (
            <View
              key={item.option}
              style={{
                flexDirection: "row",
                gap: 15,
                paddingHorizontal: 12,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
                backgroundColor: "#fff",
              }}
            >
              <View style={{ flex: 1, gap: 8 }}>
                <Text>{item.title}</Text>

                <Text>{item.option}</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: APP_COLOR.ORANGE }}>
                    {currencyFormatter(item.price)}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text>{item.quantity}</Text>

                    <Pressable
                      onPress={() => handlePressItem(item, "MINUS")}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                      })}
                    >
                      <AntDesign
                        name="minus-square"
                        size={26}
                        color={APP_COLOR.ORANGE}
                      />
                    </Pressable>

                    <Pressable
                      onPress={() => handlePressItem(item, "PLUS")}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.5 : 1,
                      })}
                    >
                      <AntDesign
                        name="plus-square"
                        size={26}
                        color={APP_COLOR.ORANGE}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

export default UpdateModal;
