import { useCurrentApp } from "@/src/context/app.context";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { PlaceOrder } from "@/src/utils/service";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";

interface IOderItems {
  image: string;
  title: string;
  price: number;
  quantity: number;
  option: string;
}
export default function OrderLast() {
  const [orderItems, setOrderItems] = useState<IOderItems[]>([]);
  const { address, restaurant, cart, setCart } = useCurrentApp();

  const HandlePressOrder = async () => {
    const data = {
      restaurant: restaurant?._id,
      totalPrice: cart?.[restaurant!._id].sum,
      quantity: cart?.[restaurant!._id].quantity,
      details: orderItems,
    };
    console.log(data);
    const res = await PlaceOrder(data);
    if (res.message) {
      Toast.show("Đặt hàng thành công", {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.ORANGE,
        textColor: "white",
        position: Toast.positions.TOP,
        shadow: true,
        opacity: 1,
      });

      router.navigate("/");
      if (restaurant) {
        delete cart[restaurant._id];
        setCart((prev: any) => ({ ...prev, ...cart }));
      }
    } else {
      const m = Array.isArray(res.message) ? res.message[0] : res.message;
      Toast.show(m, {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.ORANGE,
        textColor: "white",
        position: Toast.positions.TOP,
        shadow: true,
        opacity: 1,
      });
    }
  };
  const baseImg = `${process.env.EXPO_PUBLIC_API_URL}/images/menu-item`;

  useEffect(() => {
    if (!cart || !restaurant?._id || !cart[restaurant._id]) {
      setOrderItems([]);
      return;
    }

    const result: IOderItems[] = [];

    for (const [, currentTimes] of Object.entries(cart[restaurant._id].items)) {
      if (currentTimes.extra) {
        for (const [key, value] of Object.entries(currentTimes.extra)) {
          const option = currentTimes.data.options?.find(
            (item: any) => `${item.title}-${item.description}` === key,
          );

          const addPrice = option?.additionalPrice ?? 0;

          result.push({
            image: `${baseImg}/${currentTimes.data.image}`,
            title: currentTimes.data.title,
            price: currentTimes.data.basePrice + addPrice,
            option: key,
            quantity: value as number,
          });
        }
      } else {
        result.push({
          image: `${baseImg}/${currentTimes.data.image}`,
          title: currentTimes.data.title,
          price: currentTimes.data.basePrice,
          option: "",
          quantity: currentTimes.quantity,
        });
      }
    }

    setOrderItems(result);
  }, [cart, restaurant, baseImg]);
  if (!address) return null;

  const FOOTER_HEIGHT = 170;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 10 }}>
        <Text>Địa chỉ giao hàng</Text>
        <Text>{address}</Text>

        <View
          style={{
            height: 1,
            backgroundColor: "#ccc",
            marginVertical: 8,
          }}
        />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Thông tin đơn hàng
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: FOOTER_HEIGHT + 20,
          }}
        >
          {orderItems.map((item, index) => (
            <View
              key={`${item.title}-${item.option}-${index}`}
              style={{
                flexDirection: "row",
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#f1f1f1",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 12,
                  marginRight: 14,
                }}
                resizeMode="cover"
              />

              <View style={{ flex: 1, justifyContent: "space-between" }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#222",
                  }}
                >
                  {item.title}
                </Text>

                {!!item.option && (
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      color: "#777",
                      marginTop: 4,
                    }}
                  >
                    {item.option}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#666",
                    }}
                  >
                    x{item.quantity}
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: APP_COLOR.ORANGE,
                    }}
                  >
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: FOOTER_HEIGHT,
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingTop: 15,
          paddingBottom: 20,
          borderTopWidth: 1,
          borderTopColor: "#eee",
          elevation: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              borderWidth: 1,
              paddingVertical: 14,
              borderColor: APP_COLOR.GRAY,
              alignItems: "center",
            }}
            disabled
          >
            <Text style={{ color: APP_COLOR.GRAY, fontWeight: "bold" }}>
              Tiền mặt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              borderWidth: 1,
              paddingVertical: 14,
              borderColor: APP_COLOR.ORANGE,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "black", fontWeight: "bold" }}>
              Chuyển khoản
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={HandlePressOrder}
          style={{
            backgroundColor: "#FF3B30",
            paddingVertical: 16,

            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Đặt đơn
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
