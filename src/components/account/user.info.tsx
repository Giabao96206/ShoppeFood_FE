import ShareInput from "@/src/components/inputs/share.inputs";
import { useCurrentApp } from "@/src/context/app.context";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-root-toast";

export default function UserInfo() {
  const { appState, setAppState } = useCurrentApp();
  const [name, setName] = useState(appState?.user.name || "");
  const [email, setEmail] = useState(appState?.user.email || "");
  const [phone, setPhone] = useState(appState?.user.phone || "");
  const [avatar, setAvatar] = useState(appState?.user.avatar || "");

  const EditAccount = async (formData: any) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/editUser`,
        {
          method: "POST", // Hoặc PUT, nhớ kiểm tra lại cho khớp BE
          headers: {
            Authorization: `Bearer ${appState?.access_token}`,
          },
          body: formData,
        },
      );

      // 1. CHẶN LẠI Ở ĐÂY: Đọc response dưới dạng text thô trước
      const textData = await response.text();
      // console.log(textData)

      // 2. Nếu status ok thì mới parse JSON
      if (response.ok) {
        const jsonData = JSON.parse(textData);
        setAppState({
          user: jsonData.user,
          access_token: await AsyncStorage.getItem("access_token"),
        });
        Toast.show("Chỉnh sửa thành công", {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.ORANGE,
          textColor: "white",
          position: Toast.positions.TOP,
          shadow: true,
          opacity: 1,
        });
      } else {
        const m = Array.isArray(response.message)
          ? response.message[0]
          : response.message;
        Toast.show(m, {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.ORANGE,
          textColor: "white",
          position: Toast.positions.TOP,
          shadow: true,
          opacity: 1,
        });
      }
    } catch (error) {
      console.log("Lỗi catch:", error);
    }
  };
  const HandleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);

    if (avatar) {
      formData.append("avatar", {
        uri: avatar,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);
    }
    await EditAccount(formData);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Bạn cần cấp quyền truy cập ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }

    console.log(avatar);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <View style={{ alignItems: "center", gap: 5 }}>
            <Pressable onPress={pickImage}>
              <Image
                style={{ width: 100, height: 100, borderRadius: 100 }}
                source={{ uri: avatar }}
              />
            </Pressable>
            <Text>{appState?.user.name}</Text>
          </View>
          <View style={{ marginTop: 20, gap: 20 }}>
            <ShareInput title="Họ Tên" value={name} onChangeText={setName} />
            <ShareInput title="Email" value={email} onChangeText={setEmail} />
            <ShareInput
              title="Số Điện Thoại"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <TouchableOpacity
            onPress={HandleSubmit}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                backgroundColor: APP_COLOR.ORANGE,
                padding: 12,
                borderRadius: 10,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
