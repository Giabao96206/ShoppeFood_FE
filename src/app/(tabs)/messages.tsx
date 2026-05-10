import { useCurrentApp } from "@/src/context/app.context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// 1. Định nghĩa kiểu dữ liệu cho người dùng
interface User {
  id: string;
  name: string;
  lastMessage: string;
}

// 2. Định nghĩa kiểu cho Navigation (Chỉnh sửa 'Chat' thành tên màn hình chat thực tế của bạn)
type RootStackParamList = {
  Chat: { userName: string };
};

type MessageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Chat"
>;

// 3. Dữ liệu giả (Mock Data)
const USERS: User[] = [
  { id: "1", name: "Nguyễn Văn A", lastMessage: "Hôm nay đi cà phê không?" },
  { id: "2", name: "Trần Thị B", lastMessage: "Báo cáo làm xong chưa cậu?" },
  { id: "3", name: "Lê Hoàng C", lastMessage: "Ok chốt vậy nhé!" },
  { id: "4", name: "Phạm D", lastMessage: "Đang bận chút, xíu gọi lại." },
];

export default function Message() {
  // Hàm render từng dòng người dùng
  const { setUserSend } = useCurrentApp();

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        setUserSend(item);
        router.navigate({
          pathname: "/(user)/message/SendMessage",
          params: { id: item.id, name: item.name },
        });
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={USERS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // Thêm padding dưới cùng để không bị lấp bởi Bottom Tab
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

// 4. CSS / Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lastMessage: {
    color: "#666",
  },
});
