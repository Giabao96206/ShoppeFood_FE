import { APP_COLOR } from "@/src/utils/APP_COLOR";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
const SearchHome = () => {
  return (
    <View style={styles.blueBox}>
      <Feather name="search" size={24} color="black" />
      <Text style={{ color: "black", fontWeight: "bold" }}>
        Deal Hot Hôm Nay từ 0..
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  blueBox: {
    marginHorizontal: 2,
    backgroundColor: APP_COLOR.GRAY,
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    margin: 4,
  },
});

export default SearchHome;
