import ShareInput from "@/src/components/inputs/share.inputs";
import { useCurrentApp } from "@/src/context/app.context";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function Account() {
  const { appState } = useCurrentApp();
  const BaseImage = appState?.user.avatar;

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", gap: 5 }}>
        <Image
          style={{ width: 150, height: 150, borderRadius: 100 }}
          source={{ uri: `${BaseImage}` }}
        />
        <Text>{appState?.user.name}</Text>
      </View>
      <View style={{ marginTop: 20, gap: 20 }}>
        <ShareInput title="Họ Tên" value={appState?.user.name} />
        <ShareInput title="Email" value={appState?.user.email} />
        <ShareInput title="Số Điện Thoại" value={appState?.user.phone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
