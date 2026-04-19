import { Image } from "expo-image";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import Banner from "./banner.home";

const data1 = [
  {
    key: 1,
    name: "Hot Deal",
    source: require("@/src/assets/banner_icon/icons/flash-deals.png"),
  },
  {
    key: 2,
    name: "Quán Ngon",
    source: require("@/src/assets/banner_icon/icons/nice-shop.png"),
  },
  {
    key: 3,
    name: "Tích Điểm",
    source: require("@/src/assets/banner_icon/icons/points.png"),
  },
  {
    key: 4,
    name: "Ngọt Xỉu",
    source: require("@/src/assets/banner_icon/icons/rice.png"),
  },
  {
    key: 5,
    name: "Quán Tiền Bối",
    source: require("@/src/assets/banner_icon/icons/noodles.png"),
  },
  {
    key: 6,
    name: "Bún, Mì, Phở",
    source: require("@/src/assets/banner_icon/icons/bun-pho.png"),
  },
  {
    key: 7,
    name: "BBQ",
    source: require("@/src/assets/banner_icon/icons/bbq.png"),
  },
  {
    key: 8,
    name: "Fast Food",
    source: require("@/src/assets/banner_icon/icons/fastfood.png"),
  },
  {
    key: 9,
    name: "Pizza",
    source: require("@/src/assets/banner_icon/icons/Pizza.png"),
  },
  {
    key: 10,
    name: "Burger",
    source: require("@/src/assets/banner_icon/icons/burger.png"),
  },
  {
    key: 11,
    name: "Sống Khỏe",
    source: require("@/src/assets/banner_icon/icons/egg-cucmber.png"),
  },
  {
    key: 12,
    name: "Giảm 50k",
    source: require("@/src/assets/banner_icon/icons/moi-moi.png"),
  },
  {
    key: 13,
    name: "99k Off",
    source: require("@/src/assets/banner_icon/icons/fried-chicken.png"),
  },
  {
    key: 14,
    name: "No Bụng",
    source: require("@/src/assets/banner_icon/icons/korean-food.png"),
  },
  {
    key: 15,
    name: "Freeship",
    source: require("@/src/assets/banner_icon/icons/Steak.png"),
  },
  {
    key: 16,
    name: "Deal 0Đ",
    source: require("@/src/assets/banner_icon/icons/tomato.png"),
  },
  {
    key: 17,
    name: "Món 1Đ",
    source: require("@/src/assets/banner_icon/icons/elipse.png"),
  },
  {
    key: 18,
    name: "Ăn chiều",
    source: require("@/src/assets/banner_icon/icons/chowmein.png"),
  },
  {
    key: 19,
    name: "Combo 199k",
    source: require("@/src/assets/banner_icon/icons/Notif.png"),
  },
  {
    key: 20,
    name: "Milk Tea",
    source: require("@/src/assets/banner_icon/icons/salad.png"),
  },
];

const TopListHome = () => {
  return (
    <View style={Styles.topList}>
      <Banner />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled={true}
        alwaysBounceVertical={false}
        style={{ marginVertical: 15 }}
      >
        <FlatList
          contentContainerStyle={{
            alignContent: "flex-start",
          }}
          numColumns={Math.ceil(data1.length / 2)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data1}
          renderItem={({ item, index }) => {
            return (
              <View style={{ padding: 5, width: 100, alignItems: "center" }}>
                <Image source={item.source} style={Styles.item} />
                <Text style={{ textAlign: "center" }}>{item.name}</Text>
              </View>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

const Styles = StyleSheet.create({
  topList: {
    minHeight: 100,
    marginBottom: 6,
    width: "100%",
  },
  item: {
    width: 40,
    height: 40,
  },
});
export default TopListHome;
