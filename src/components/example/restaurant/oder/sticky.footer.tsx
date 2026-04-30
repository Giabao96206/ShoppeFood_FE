import { useCurrentApp } from "@/src/context/app.context";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { currencyFormatter } from "@/src/utils/service";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";

interface IProp {
  sWidth: any;
  restaurant: IMenuRestaurant | null;
}
const StickyFooter = (props: IProp) => {
  const { sWidth, restaurant } = props;

  const { cart } = useCurrentApp();

  const getSum = () => {
    if (restaurant && cart[restaurant._id]) {
      return cart[restaurant._id].sum;
    }
    return 0;
  };

  return (
    <>
      {getSum() === 0 ? (
        <></>
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: sWidth,
            zIndex: 999,
            elevation: 10,
            backgroundColor: "white",
            paddingHorizontal: 10,
            height: 70,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          {/* Bên trái */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                position: "absolute",
                alignItems: "center",
                left: 30,
                top: -10,
                width: 16,
                height: 16,
                backgroundColor: APP_COLOR.ORANGE,
                justifyContent: "center",
                borderRadius: 16 / 2,
              }}
            >
              <Text style={{ color: "white", fontSize: 9 }}>
                {restaurant &&
                  cart &&
                  cart[restaurant._id] &&
                  cart[restaurant?._id!]["quantity"] && (
                    <>{cart[restaurant?._id!]["quantity"]}</>
                  )}
              </Text>
            </View>
            <Pressable onPress={() => Alert.alert("Hi")}>
              <FontAwesome5
                name="shopping-basket"
                size={30}
                color={APP_COLOR.ORANGE}
              />
            </Pressable>
          </View>

          {/* Bên phải */}
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Text
              style={{
                color: APP_COLOR.ORANGE,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {currencyFormatter(getSum())}
            </Text>
            <Text
              style={{
                color: "white",
                backgroundColor: APP_COLOR.ORANGE,
                padding: 10,
                fontSize: 16,
                fontWeight: "600",
                borderRadius: 10,
              }}
            >
              Giao hàng
            </Text>
          </TouchableOpacity>
        </View>
      )}                   
    </>
  );
};

export default StickyFooter;
