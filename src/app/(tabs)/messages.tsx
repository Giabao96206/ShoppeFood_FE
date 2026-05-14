import { useCurrentApp } from "@/src/context/app.context";
import { GetAllUser } from "@/src/utils/service";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Message() {
  const { setUserSend, setLastMessgae, lastMessgae, appState } =
    useCurrentApp();

  useEffect(() => {
    const fetchDT = async () => {
      const res = await GetAllUser();
      if (res.status === "200") {
        setLastMessgae(res.data || []);
      }
    };
    fetchDT();
  }, []);

  const renderItem = ({ item }: { item: IUser }) => {
    const lastMsg = item.lastMessage.content;
    const isRead = item.lastMessage.is_read;
    const createdAt = item.lastMessage.createdAt;

    const isOtherUser = item.lastMessage.sender_id === item.otherUser._id;
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => {
          setUserSend(item.otherUser);
          router.navigate({
            pathname: "/(user)/message/SendMessage",
            params: {
              id: item.otherUser._id,
              name: item.otherUser.name,
              avatar: item.otherUser.avatar,
              conversationId: item._id,
            },
          });
        }}
      >
        {/* Avatar */}
        <View style={styles.avatar}>
          {item.otherUser.avatar ? (
            <Image
              source={{ uri: item.otherUser.avatar }}
              style={styles.avatarImg}
            />
          ) : (
            <Text style={styles.avatarText}>
              {item.otherUser.name.charAt(0)}
            </Text>
          )}
        </View>

        {/* Info */}
        <View style={styles.userInfo}>
          <View style={styles.rowTop}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.otherUser.name}
            </Text>

            {/* time (optional) */}
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
              isOtherUser && !isRead && styles.unreadMessage,
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
