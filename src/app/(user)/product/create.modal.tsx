import ItemSingle from "@/src/components/example/restaurant/oder/item.single";
import { useCurrentApp } from "@/src/context/app.context";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { currencyFormatter } from "@/src/utils/service";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";

const CreateModalPage = () => {
  const { restaurant, cart, setCart } = useCurrentApp();
  const { menuItemId } = useLocalSearchParams();

  const [menuItem, setMenuItem] = useState<IMenuItems | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const HandlePresItem = (item: IMenuItems, action: "MINUS" | "PLUS") => {
    if (action === "MINUS" && quantity === 1) return;
    const total = action === "MINUS" ? -1 : 1;
    setQuantity((prevQuantity: number) => prevQuantity + total);
  };

  const HandleAddCart = () => {
    if (!restaurant?._id || !menuItem) return;

    const newCart = { ...cart };

    if (!newCart[restaurant._id]) {
      newCart[restaurant._id] = {
        sum: 0,
        quantity: 0,
        items: {},
      };
    }

    const store = newCart[restaurant._id];
    const item = menuItem;
    const option = item.options[selectedIndex];
    const keyOption = `${option.title}-${option.description}`;

    store.sum += quantity * (item.basePrice + option.additionalPrice);
    store.quantity += quantity;

    if (!store.items[item._id]) {
      store.items[item._id] = {
        quantity: 0,
        data: item,
        extra: {},
      };
    }

    const currentItem = store.items[item._id];

    currentItem.quantity += quantity;
    currentItem.extra = {
      ...currentItem.extra,
      [keyOption]: (currentItem.extra?.[keyOption] || 0) + quantity,
    };

    setCart(newCart);
    router.back();
  };
  useEffect(() => {
    if (!restaurant || !menuItemId) return;

    const foundItem = restaurant.menus
      .flatMap((menu) => menu.menuItems)
      .find((item) => item._id === menuItemId);

    setMenuItem(foundItem || null);
  }, [restaurant, menuItemId]);

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#00000040",
      }}
    >
      <Pressable
        onPress={() => router.back()}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        entering={SlideInDown}
        style={{
          height: "80%",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            borderBottomColor: "#eee",
            borderBottomWidth: 1,
            flexDirection: "row",
            gap: 10,
            padding: 10,
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Thêm món mới
            </Text>
          </View>
          <AntDesign
            onPress={() => router.back()}
            name="close"
            size={24}
            color="grey"
          />
        </View>

        <View
          style={{
            borderBottomColor: "#eee",
            borderBottomWidth: 1,
          }}
        >
          {menuItem && (
            <ItemSingle
              menuIT={menuItem}
              showMinus={true}
              quantity={quantity}
              HandlePresItem={HandlePresItem}
            />
          )}
        </View>

        <View
          style={{
            backgroundColor: "#eee",
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <Text>Lựa chọn (chọn 1)</Text>
        </View>

        <ScrollView
          style={{
            flex: 1,
            borderBottomColor: "#eee",
            borderBottomWidth: 1,
          }}
        >
          {menuItem?.options?.map((item, index) => {
            return (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                  flexDirection: "row",
                }}
                key={index}
              >
                <View style={{ gap: 5, flex: 1 }}>
                  <Text>
                    {item.title} - {item.description}{" "}
                  </Text>
                  <Text style={{ color: APP_COLOR.ORANGE }}>
                    {currencyFormatter(item.additionalPrice)}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    onPress={() => setSelectedIndex(index)}
                    style={({ pressed }) => ({
                      opacity: pressed === true ? 0.5 : 1,
                      alignSelf: "flex-start",
                      padding: 2,
                      borderRadius: 2,
                      backgroundColor:
                        index === selectedIndex ? APP_COLOR.ORANGE : "white",

                      borderColor:
                        index === selectedIndex ? APP_COLOR.ORANGE : "grey",
                      borderWidth: 1,
                    })}
                  >
                    <Feather name="check" size={15} color="white" />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={{
            marginBottom: 20,
            marginTop: 10,
            marginHorizontal: 10,
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed === true ? 0.5 : 1,
              padding: 10,
              backgroundColor: APP_COLOR.ORANGE,
              borderRadius: 3,
            })}
            onPress={HandleAddCart}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              Thêm vào giỏ hàng
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default CreateModalPage;
