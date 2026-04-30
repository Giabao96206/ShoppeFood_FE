import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { currencyFormatter } from "@/src/utils/service";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

interface IProps {
  menuIT: IMenuItems;
  HandlePresItem: (item: IMenuItems, action: "MINUS" | "PLUS") => void;
  showMinus: boolean;
  quantity: number;
}

const ItemSingle = (props: IProps) => {
  const { menuIT, HandlePresItem, showMinus, quantity } = props;

  const baseImg2 = `${process.env.EXPO_PUBLIC_API_URL}/images/menu-item`;
  return (
    <>
      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          gap: 10,
          flexDirection: "row",
        }}
      >
        <View>
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `${baseImg2}/${menuIT?.image}` }}
          />
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          <View>
            <Text> {menuIT?.title}</Text>
          </View>
          <View>
            <Text> {menuIT?.description}</Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={{ color: APP_COLOR.ORANGE }}>
              {currencyFormatter(menuIT?.basePrice)}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
            >
              {showMinus && (
                <>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        opacity: pressed === true ? 0.5 : 1,
                        alignSelf: "flex-start", //fit-content
                      },
                    ]}
                    onPress={() => HandlePresItem(menuIT, "MINUS")}
                  >
                    <AntDesign name="minus-square" size={20} color="orange" />
                  </Pressable>

                  <Text style={{ minWidth: 25, textAlign: "center" }}>
                    {quantity}
                  </Text>
                </>
              )}
              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed === true ? 0.5 : 1,
                    alignSelf: "flex-start", //fit-content
                  },
                ]}
                onPress={() => HandlePresItem(menuIT, "PLUS")}
              >
                <Entypo
                  name="squared-plus"
                  size={24}
                  color={APP_COLOR.ORANGE}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default ItemSingle;
