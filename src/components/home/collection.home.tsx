import demo from "@/src/assets/images/demo.jpg";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { Image } from "expo-image";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface IProps {
  name: string;
  description: string;
}

export default function CollectionHome(props: IProps) {
  const { name, description } = props;
  const data = [
    {
      key: 1,
      image: demo,
      name: "Cửa hàng 1",
    },
    {
      key: 2,
      image: demo,
      name: "Cửa hàng 1",
    },
    {
      key: 3,
      image: demo,
      name: "Cửa hàng 1",
    },
    {
      key: 4,
      image: demo,
      name: "Cửa hàng 1",
    },
    {
      key: 5,
      image: demo,
      name: "Cửa hàng 1",
    },
  ];
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
        <FlatList
          data={data}
          horizontal
          contentContainerStyle={{ gap: 5 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={{ backgroundColor: "#efefef" }}>
                <Image style={{ height: 130, width: 130 }} source={demo} />
                <View style={{ padding: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                  <View style={styles.sale}>
                    <Text style={{ color: APP_COLOR.ORANGE }}>Flash Sale</Text>
                  </View>
                </View>
              </View>
            );
          }}
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
