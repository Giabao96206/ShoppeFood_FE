import { View, TouchableOpacity, Text } from "react-native";
import { ThemedText } from "@/src/components/themed-text";
import { router } from "expo-router";
// import { Link } from "expo-router";

export default function Home_Detail() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
      }}
    >
      <ThemedText>Em như làn mây như lời hát</ThemedText>
      <TouchableOpacity
        onPress={() => router.navigate("/Home")}
        style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}
      >
        <Text>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
