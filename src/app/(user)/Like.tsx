import { ThemedText } from "@/src/components/themed-text";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
// import { Link } from "expo-router";

export default function Like() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
      }}
    >
      <ThemedText>Trang Login Detail</ThemedText>
      <TouchableOpacity
        onPress={() => router.canGoBack()}
        style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}
      >
        <Text>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
