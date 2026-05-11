import { useCurrentApp } from "@/src/context/app.context";
import { GetAllUser } from "@/src/utils/service";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getSocket } from "../socket";

export default function Message() {
  // Hàm render từng dòng người dùng
  const { setUserSend } = useCurrentApp();

  const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);
  const socket = getSocket();

  socket.on("receive_new_message", (message) => {
    setNewMessageAlert("Bạn có tin nhắn mới");

    // tự ẩn sau 2s
    setTimeout(() => {
      setNewMessageAlert(null);
    }, 2000);
  });

  const [dataUS, setDataUS] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchDT = async () => {
      const res = await GetAllUser();
      if (res.status === "200") {
        setDataUS(res.data);
      }
    };
    fetchDT();
  }, []);

  const renderItem = ({ item }: { item: IUser }) => (
    <>
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => {
          setUserSend(item);
          router.navigate({
            pathname: "/(user)/message/SendMessage",
            params: { id: item._id, name: item.name, avatar: item.avatar },
          });
        }}
      >
        <View style={styles.avatar}>
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      {newMessageAlert && (
        <View
          style={{
            position: "absolute",
            top: 50,
            alignSelf: "center",
            backgroundColor: "#000",
            padding: 10,
            borderRadius: 10,
            zIndex: 999,
          }}
        >
          <Text style={{ color: "white" }}>{newMessageAlert}</Text>
        </View>
      )}
      <FlatList
        data={dataUS}
        keyExtractor={(item) => item._id}
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
