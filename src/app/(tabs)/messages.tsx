import { useCurrentApp } from "@/src/context/app.context";
import { GetAllUser } from "@/src/utils/service";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    AppState,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getSocket } from "../socket";

export default function Message() {
  const { setUserSend, setLastMessgae, lastMessgae, appState } =
    useCurrentApp();

  // 1. LẤY ID CỦA CHÍNH USER ĐANG ĐĂNG NHẬP
  const currentUserId = appState?.user?._id;
  const appStateRef = useRef(AppState.currentState);

  // XÓA: Không cần [online, setOnline] và [onlineUsers, setOnlineUsers] nữa

  useEffect(() => {
    const fetchDT = async () => {
      const res = await GetAllUser();
      if (res.status === "200") {
        setLastMessgae(res.data || []);
        console.log(res.data);

        const socket = getSocket();
        if (socket) {
          socket.emit("request_online_users");
        }
      }
    };
    fetchDT();
  }, []);

  // UseEffect xử lý Socket tin nhắn
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleGlobalSeen = ({ conversationId }: any) => {
      setLastMessgae((prev: IUser[]) =>
        (prev || []).map((item) => {
          if (item._id === conversationId) {
            return {
              ...item,
              lastMessage: item.lastMessage
                ? { ...item.lastMessage, is_read: true }
                : item.lastMessage,
            };
          }
          return item;
        }),
      );
    };

    const handleGlobalReceive = (message: any) => {
      setLastMessgae((prev: IUser[]) => {
        return (prev || []).map((item) => {
          if (
            item._id === message.conversation_id ||
            item._id === message.conversationId
          ) {
            return {
              ...item,
              lastMessage: {
                sender_id: message.sender_id,
                content: message.content,
                createdAt: message.createdAt || new Date().toISOString(),
                is_read: false,
              },
            };
          }
          return item;
        });
      });
    };

    socket.on("message_seen", handleGlobalSeen);
    socket.on("receive_new_message", handleGlobalReceive);

    return () => {
      socket.off("message_seen", handleGlobalSeen);
      socket.off("receive_new_message", handleGlobalReceive);
    };
  }, []);

  // UseEffect xử lý Trạng thái Online/Offline
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleGetOnlineUsers = (usersArray: any) => {
      // CHỈ CẦN cập nhật thẳng vào Context
      setLastMessgae((prev: IUser[]) =>
        (prev || []).map((item) => {
          const isUserOnline = usersArray.includes(
            item.otherUser?._id?.toString(),
          );
          return {
            ...item,
            otherUser: { ...item.otherUser, is_online: isUserOnline },
          };
        }),
      );
    };

    const handleUserOnline = (userId: any) => {
      setLastMessgae((prev: IUser[]) =>
        (prev || []).map((item) => {
          if (item.otherUser?._id?.toString() === userId?.toString()) {
            return {
              ...item,
              otherUser: { ...item.otherUser, is_online: true },
            };
          }
          return item;
        }),
      );
    };

    const handleUserOffline = ({ userId, last_seen }: any) => {
      setLastMessgae((prev: IUser[]) =>
        (prev || []).map((item) => {
          if (item.otherUser?._id?.toString() === userId?.toString()) {
            return {
              ...item,
              otherUser: {
                ...item.otherUser,
                is_online: false,
                last_seen: last_seen,
              },
            };
          }
          return item;
        }),
      );
    };

    socket.on("get_online_users", handleGetOnlineUsers);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);
    // Xử lý khi App bị ẩn xuống nền (Background) hoặc mở lại (Active)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        if (!socket.connected) socket.connect();
      } else if (nextAppState === "background") {
        socket.disconnect();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      socket.off("get_online_users", handleGetOnlineUsers);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      subscription.remove();
    };
  }, []);

  const renderItem = ({ item }: { item: IUser }) => {
    const lastMsg = item.lastMessage?.content || "Bắt đầu cuộc trò chuyện";
    const isRead = item.lastMessage?.is_read ?? true;
    const createdAt = item.lastMessage?.createdAt;

    // 👇 CHỈNH SỬA Ở ĐÂY: Lấy isOnline trực tiếp từ Context (otherUser)
    const isOnline = item.otherUser?.is_online;

    const shouldShowUnread =
      item.lastMessage?.sender_id !== currentUserId && !isRead;
    const isOtherUser = item.lastMessage?.sender_id === item.otherUser?._id;

    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          shouldShowUnread
            ? { backgroundColor: "#E8F0FE" }
            : { backgroundColor: "transparent" },
        ]}
        onPress={() => {
          if (shouldShowUnread) {
            setLastMessgae((prev: IUser[]) =>
              (prev || []).map((conv) => {
                if (conv._id?.toString() === item._id?.toString()) {
                  return {
                    ...conv,
                    lastMessage: { ...conv.lastMessage, is_read: true },
                  };
                }
                return conv;
              }),
            );
          }

          setUserSend(item.otherUser);
          router.navigate({
            pathname: "/(user)/message/SendMessage",
            params: {
              id: item.otherUser._id,
              name: item.otherUser.name,
              avatar: item.otherUser.avatar,
              conversationId: item._id,
              backgroundImage: item.backgroundImage,
            },
          });
        }}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          {item.otherUser?.avatar ? (
            <Image
              source={{ uri: item.otherUser.avatar }}
              style={styles.avatarImg}
            />
          ) : (
            <Text style={styles.avatarText}>
              {item.otherUser?.name?.charAt(0) || "?"}
            </Text>
          )}
          {isOnline && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#31A24C",
                borderWidth: 2,
                borderColor: "#FFFFFF",
              }}
            />
          )}
        </View>

        {/* Info */}
        <View style={styles.userInfo}>
          <View style={styles.rowTop}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.otherUser?.name || "Người dùng ẩn danh"}
            </Text>

            <Text style={styles.time}>
              {createdAt
                ? new Date(createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </View>

          <Text
            style={[
              styles.lastMessage,
              shouldShowUnread
                ? { fontWeight: "bold", color: "#000000" }
                : { fontWeight: "normal", color: "#65676B" },
            ]}
            numberOfLines={1}
          >
            {isOtherUser ? lastMsg : `Bạn: ${lastMsg}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={lastMessgae}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        // 👇 CHỈNH SỬA Ở ĐÂY: Vì đã xóa onlineUsers nên extraData chỉ cần lastMessgae
        extraData={lastMessgae}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  userItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#EDEDED",
    alignItems: "center",
  },
  unreadMessage: {
    fontWeight: "700",
    color: "#000",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  avatarImg: {
    width: 52,
    height: 52,
  },

  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  userInfo: {
    flex: 1,
    justifyContent: "center",
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },

  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },

  time: {
    fontSize: 12,
    color: "#999",
  },
});
