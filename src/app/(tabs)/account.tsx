import { useCurrentApp } from "@/src/context/app.context";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function Account() {
  const { setHasLocation, setAddress } = useCurrentApp();
  const accountMenu = [
    {
      id: "edit",
      title: "Chỉnh sửa thông tin",
      icon: "user-edit",
      ref: "/account/info",
    },
    {
      id: "password",
      title: "Thay đổi mật khẩu",
      icon: "lock",
      ref: "/account/info",
    },
    {
      id: "language",
      title: "Ngôn ngữ",
      icon: "language",
      ref: "/account/info",
    },
  ];

  const HandlePress = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xác nhận",
        onPress: async () => {
          await AsyncStorage.removeItem("access_token");
          router.replace("/(auth)/welcome");
          setHasLocation(false);
          setAddress("Đang tìm vị trí của bạn...");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* MENU */}
      <View style={styles.menuBox}>
        {accountMenu.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => item.ref && router.push(item.ref as any)}
            style={styles.row}
          >
            <View style={styles.left}>
              <FontAwesome5 name={item.icon} size={18} color="#ff6b35" />
              <Text style={styles.text}>{item.title}</Text>
            </View>

            <MaterialIcons name="navigate-next" size={24} color="#999" />
          </Pressable>
        ))}
      </View>

      {/* FOOTER - LOGOUT LUÔN DƯỚI CÙNG */}
      <View style={styles.footer}>
        <Pressable onPress={HandlePress} style={styles.logoutBtn}>
          <FontAwesome5 name="sign-out-alt" size={18} color="#fff" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 20,
    justifyContent: "space-between",
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  email: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },

  menuBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },

  footer: {
    marginTop: 20,
  },

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 999,
    gap: 10,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
});
