import { useCurrentApp } from "@/src/context/app.context";
import { GetAI, GetAllMessages, GetMoreMessages } from "@/src/utils/service";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getSocket } from "../../socket";

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 60,
  };

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const [cursor, setCursor] = useState<string | null>(null);

  const [loadingMore, setLoadingMore] = useState(false);

  const { appState, setLastMessgae, lastMessgae } = useCurrentApp();

  const { id, name, avatar, conversationId } = useLocalSearchParams();

  const [messages, setMessages] = useState<IMessgages[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [inputText, setInputText] = useState("");

  const userId = appState?.user?._id;

  const onEndReachedCalledDuringMomentum = useRef(false);

  // ASK AI ------------------------------------------------/

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [hasCheckedAI, setHasCheckedAI] = useState(false);

  const handleCallAI = async (unreadMessages: IMessgages[]) => {
    setIsSummarizing(true);
    try {
      const chronologicalMessages = [...unreadMessages].reverse();

      const messagesText = chronologicalMessages
        .map((msg) => `- ${msg.content}`)
        .join("\n");
      const questions = `Hãy tóm tắt ngắn gọn và dễ hiểu những nội dung của các tin nhắn sau:\n${messagesText}`;
      const resAI = await GetAI(questions);
      if (resAI?.data) {
        await setAiSummary(resAI.data);
      }
    } catch (error) {
      console.log("Lỗi tóm tắt AI:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // ===================== FETCH tin nhắn khi mới vào =====================
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await GetAllMessages(conversationId as string);

        if (res?.status === 200 || res?.status === "200") {
          if (res.data) {
            const fetchedData = res.data || [];
            setMessages(res.data || []);
            setCursor(res.data[res.data.length - 1]?.createdAt);
            //
            if (!hasCheckedAI) {
              setHasCheckedAI(true); // Đánh dấu là đã kiểm tra rồi, lần sau tin nhắn mới đến sẽ KHÔNG nhảy vào đây nữa

              const unreadMessages = fetchedData.filter(
                (msg: IMessgages) =>
                  msg.sender_id !== userId && msg.status !== "read",
              );

              if (unreadMessages.length >= 10) {
                handleCallAI(unreadMessages);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // ===================== SOCKET nhận tin =====================
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceive = (message: any) => {
      setMessages((prev) => [
        {
          _id: message._id,
          conversation_id: conversationId as string,
          sender_id: message.sender_id,
          content: message.content,
          status: "sent",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    socket.on("receive_new_message", handleReceive);

    return () => {
      socket.off("receive_new_message", handleReceive);
      setLastMessgae((prev: IUser[]) =>
        prev.map((item) => {
          // Tìm đúng cuộc hội thoại vừa thoát ra và ÉP nó thành Đã đọc
          if (item._id?.toString() === conversationId?.toString()) {
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
  }, [conversationId]);

  // ============== Socket tin nhắn đã xem====================================
  useEffect(() => {
    const currentUserId = appState?.user?._id;
    const socket = getSocket();
    if (!socket) return;

    const handleSeen = ({ messageIds, conversationId }: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, status: "read" } : msg,
        ),
      );

      setLastMessgae((prev: IUser[]) =>
        prev.map((item) => {
          if (item._id === conversationId) {
            return {
              ...item,
              lastMessage: item.lastMessage
                ? {
                    ...item.lastMessage,
                    is_read: true,
                  }
                : item.lastMessage,
            };
          }

          return item;
        }),
      );
    };

    socket.on("message_seen", handleSeen);

    return () => {
      socket.off("message_seen", handleSeen);
    };
  }, []);
  // ===================== SEND =====================
  const handleSend = () => {
    const socket = getSocket();
    if (!socket) return;
    if (!inputText.trim()) return;
    if (!userId) return;

    const text = inputText.trim();

    const tempId = Date.now().toString();

    socket.emit("send_message", {
      receiverId: id,
      content: text,
      tempId, // 👈 rất quan trọng
    });

    setLastMessgae((prev: IUser[]) =>
      prev.map((user) =>
        user._id === conversationId
          ? {
              ...user,
              lastMessage: {
                ...user.lastMessage,
                sender_id: userId as string,
                content: text,
                createdAt: new Date().toISOString(),
                is_read: false,
              },
            }
          : user,
      ),
    );

    setMessages((prev) => [
      {
        _id: tempId,
        conversation_id: conversationId as string,
        sender_id: userId,
        content: text,
        status: "sent",
        createdAt: new Date().toISOString(),
        temp: true,
      },
      ...prev,
    ]);

    setInputText("");
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleSuccess = (savedMessage: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === savedMessage.tempId
            ? {
                ...savedMessage,
              }
            : msg,
        ),
      );
    };

    socket.on("message_sent_success", handleSuccess);

    return () => {
      socket.off("message_sent_success", handleSuccess);
    };
  }, []);

  //====================Load Mes khi vuốt lên===========
  const loadMoreMessages = async () => {
    if (loadingMore || !cursor || !hasMore) return;

    setLoadingMore(true);

    // giả lập loading 5s
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const res = await GetMoreMessages(conversationId as string, cursor);

    if (res.data?.length != undefined && res.data?.length > 0) {
      const newMessages: IMessgages[] = res.data;
      setMessages((prev) => {
        const map = new Map();

        [...prev, ...newMessages].forEach((msg) => {
          map.set(msg._id, msg);
        });

        return Array.from(map.values());
      });

      setCursor(newMessages[newMessages.length - 1]?.createdAt);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  // ==================================================
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const socket = getSocket();

    if (!socket) return;

    const currentUserId = appState?.user?._id;

    if (!currentUserId) return;

    const unreadMessages = viewableItems
      .map((v: any) => v.item)
      .filter(
        (msg: IMessgages) =>
          msg.sender_id !== currentUserId && msg.status !== "read",
      );

    if (unreadMessages.length === 0) return;

    const ids = unreadMessages.map((msg: IMessgages) => msg._id);

    socket.emit("mark_as_read", {
      conversationId: conversationId,
      messageIds: ids,
      senderId: id,
    });

    // update local UI luôn
    setMessages((prev) =>
      prev.map((msg) =>
        ids.includes(msg._id) ? { ...msg, status: "read" } : msg,
      ),
    );
  }).current;

  // ===================== RENDER =====================
  const renderMessage = ({
    item,
    index,
  }: {
    item: IMessgages;
    index: number;
  }) => {
    const isMe = item.sender_id === userId;
    const isSelected = selectedMessageId === item._id;

    const olderMessage = messages[index + 1];
    const newerMessage = messages[index - 1];

    const isGrouped = (msg1: IMessgages, msg2: IMessgages) => {
      if (!msg1 || !msg2) return false;
      if (msg1.sender_id !== msg2.sender_id) return false;

      const timeDiff = Math.abs(
        new Date(msg1.createdAt).getTime() - new Date(msg2.createdAt).getTime(),
      );
      return timeDiff < 3 * 60 * 1000;
    };

    const groupedWithOlder = isGrouped(item, olderMessage);
    const groupedWithNewer = isGrouped(item, newerMessage);

    const marginBottom = groupedWithNewer ? 2 : 12;

    const showAvatar = !isMe && !groupedWithNewer;

    let bubbleStyle: any = {
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      maxWidth: "75%",
      backgroundColor: isMe ? "#0084FF" : "#E4E6EB",
    };

    if (isMe) {
      if (groupedWithOlder) bubbleStyle.borderTopRightRadius = 4;
      if (groupedWithNewer) bubbleStyle.borderBottomRightRadius = 4;
    } else {
      if (groupedWithOlder) bubbleStyle.borderTopLeftRadius = 4;
      if (groupedWithNewer) bubbleStyle.borderBottomLeftRadius = 4;
    }

    return (
      <View style={{ marginBottom }}>
        <View
          style={[
            styles.messageRow,
            isMe
              ? { justifyContent: "flex-end" }
              : { justifyContent: "flex-start", alignItems: "flex-end" }, // alignItems flex-end để avatar rớt xuống đáy cụm
          ]}
        >
          {!isMe && (
            <View
              style={{
                width: 28,
                marginRight: 8,
                height: 28,
                justifyContent: "flex-end",
              }}
            >
              {showAvatar && (
                <Image
                  source={{ uri: avatar as string }}
                  style={{ width: 28, height: 28, borderRadius: 14 }}
                />
              )}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedMessageId(isSelected ? null : item._id)}
            style={bubbleStyle} // Áp dụng Style bo góc động vừa tính toán
          >
            <Text style={{ color: isMe ? "#FFF" : "#050505", fontSize: 15 }}>
              {item.content}
            </Text>
          </TouchableOpacity>
        </View>
        {isSelected && (
          <View
            style={[
              isMe
                ? { alignItems: "flex-end", paddingRight: 10 }
                : { alignItems: "flex-start", paddingLeft: 46 },
              { marginTop: 4 },
            ]}
          >
            <Text style={{ fontSize: 11, color: "#8E8E93" }}>
              {formatTime(item.createdAt)}
              {isMe && (item.status === "read" ? " • Đã xem" : " • Đã gửi")}
            </Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {(aiSummary || isSummarizing) && (
        <View style={styles.aiBannerContainer}>
          <View style={styles.aiBannerHeader}>
            <Text style={styles.aiBannerTitle}>✨ Tóm tắt bằng AI</Text>
            {/* Nút tắt để người dùng đóng Banner khi đã đọc xong */}
            <TouchableOpacity
              onPress={() => {
                setAiSummary(null);
                setIsSummarizing(false);
              }}
            >
              <Text style={styles.aiBannerClose}>✕</Text>
            </TouchableOpacity>
          </View>

          {isSummarizing ? (
            <Text style={styles.aiBannerText}>
              Đang phân tích tin nhắn chưa đọc...
            </Text>
          ) : (
            <Text style={styles.aiBannerText}>{aiSummary}</Text>
          )}
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => renderMessage({ item, index })}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.2}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ padding: 10 }}>
              <Text>Đang tải tin nhắn...</Text>
            </View>
          ) : null
        }
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            loadMoreMessages();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        viewabilityConfigCallbackPairs={
          useRef([
            {
              viewabilityConfig,
              onViewableItemsChanged,
            },
          ]).current
        }
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Nhập tin nhắn..."
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim()}
          style={styles.sendButton}
        >
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
// ===================== STYLE =====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },

  listContent: {
    padding: 15,
    paddingBottom: 20,
  },

  messageRow: {
    flexDirection: "row",

    alignItems: "flex-end",
  },

  messageRowMe: {
    justifyContent: "flex-end",
  },

  messageRowThem: {
    justifyContent: "flex-start",
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },

  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 18,
  },

  bubbleMe: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },

  bubbleThem: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 15,
  },

  textMe: { color: "#fff" },
  textThem: { color: "#000" },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  input: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 15,
  },

  sendButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 20,
  },

  sendButtonDisabled: {
    backgroundColor: "#A1C6EA",
  },

  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  //
  // Thêm vào StyleSheet
  aiBannerContainer: {
    position: "absolute",
    top: 10, // Cách đỉnh màn hình 10px
    left: 15,
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Nền trắng hơi trong suốt
    padding: 15,
    borderRadius: 16, // Bo góc bự
    zIndex: 100, // Ép nó nổi lên trên cả FlatList
    // Đổ bóng cho đẹp
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Đổ bóng cho Android
  },
  aiBannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0084FF", // Xanh giống Messenger
  },
  aiBannerClose: {
    fontSize: 16,
    color: "#8E8E93",
    paddingHorizontal: 5,
  },
  aiBannerText: {
    fontSize: 14,
    color: "#050505",
    lineHeight: 20,
  },
});
