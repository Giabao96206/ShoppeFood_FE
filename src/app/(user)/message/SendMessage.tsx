import { useCurrentApp } from "@/src/context/app.context";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { GetAI, GetAllMessages, GetMoreMessages } from "@/src/utils/service";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native"; // Dùng để làm hiệu ứng icon mượt mà
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
import { getSocket } from "../../socket";

export default function ChatScreen() {
  const swipeRefs = useRef<Record<string, Swipeable | null>>({});

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
  // State lưu trữ thông tin tin nhắn mà người dùng đang muốn reply
  const [replyingMessage, setReplyingMessage] = useState<IMessgages | null>(
    null,
  );

  const [cursor, setCursor] = useState<string | null>(null);

  const [loadingMore, setLoadingMore] = useState(false);

  const { appState, setLastMessgae, lastMessgae } = useCurrentApp();

  const { id, name, avatar, conversationId, backgroundImage } =
    useLocalSearchParams();

  const [chatWallpaper, setChatWallpaper] = useState<string | null>(
    (backgroundImage as string) || null,
  );

  const handleSelectWallpaper = async () => {
    const socket = getSocket();
    if (!socket) return;

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Ứng dụng cần quyền truy cập thư viện ảnh để đổi hình nền!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      const selectedUri = result.assets[0].uri;
      console.log(selectedUri);

      try {
        const formData = new FormData();

        formData.append("_id", conversationId as string);
        if (selectedUri) {
          formData.append("backgroundImage", {
            uri: selectedUri,
            name: "backgroundImage.jpg",
            type: "image/jpeg",
          } as any);
          const isSuccess = await EditMM(formData);
          if (isSuccess.status === "200") {
            setChatWallpaper(isSuccess.data);
            setLastMessgae((prev: any[]) =>
              prev.map((item) =>
                item._id === conversationId
                  ? {
                      ...item,
                      backgroundImage: isSuccess.data,
                    }
                  : item,
              ),
            );
            socket.emit("update_chat_wallpaper", {
              receiverId: id,
              conversationId: conversationId,
              backgroundImage: isSuccess.data,
            });
          }
        }
      } catch (error) {
        console.log("Lỗi up hình nền:", error);
      }
    }
  };

  const EditMM = async (formData: any) => {
    try {
      const response = await fetch("http://192.168.0.43:5000/editMM", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        Toast.show("Chỉnh sửa thành công", {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.ORANGE,
          textColor: "white",
          position: Toast.positions.TOP,
          shadow: true,
          opacity: 1,
        });
        return response.json();
      } else {
        Toast.show("Có lỗi xảy ra", {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.ORANGE,
          textColor: "white",
          position: Toast.positions.TOP,
          shadow: true,
          opacity: 1,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [messages, setMessages] = useState<IMessgages[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [inputText, setInputText] = useState("");

  const userId = appState?.user?._id;

  const onEndReachedCalledDuringMomentum = useRef(false);

  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  const scrollToMessage = (replyId: string | null) => {
    const index = messages.findIndex((msg) => msg._id === replyId);

    if (index !== -1) {
      flatListRef.current?.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5,
      });

      setHighlightedMessageId(replyId);

      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    } else {
      alert("Tin nhắn cũ chưa được tải, vui lòng cuộn lên để xem!");
    }
  };

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
              setHasCheckedAI(true);

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
      console.log(message);
      setMessages((prev) => [
        {
          _id: message._id,
          conversation_id: conversationId as string,
          sender_id: message.sender_id,
          content: message.content,
          status: "sent",
          reply_to: message.reply_to,
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

  //
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on(
      "receive_chat_wallpaper",
      (data: {
        receiverId: string;
        backgroundImage: string;
        conversationId: string;
      }) => {
        console.log(data);
        setChatWallpaper(data.backgroundImage);

        setLastMessgae((prev: IUser[]) =>
          prev.map((item) =>
            item._id === data.conversationId
              ? { ...item, backgroundImage: data.backgroundImage }
              : item,
          ),
        );
      },
    );

    // Clean up socket khi rời màn hình để tránh bị nhân đôi sự kiện (lỗi memory leak)
    return () => {
      socket.off("receive_chat_wallpaper");
    };
  }, [conversationId]);

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
      tempId,
      replyToMessageId: replyingMessage ? replyingMessage._id : null,
      name: appState.user.name,
      avatar: appState.user.avatar,
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
        reply_to: replyingMessage ? replyingMessage._id : null,
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
    const isHighlighted = highlightedMessageId === item._id;
    const isMe = item.sender_id === userId;
    const isSelected = selectedMessageId === item._id;
    const repliedMessage = item.reply_to
      ? messages.find((m) => m._id === item.reply_to)
      : null;

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

    const renderLeftActions = (progress: any, dragX: any) => {
      const scale = dragX.interpolate({
        inputRange: [0, 60],
        outputRange: [0, 1],
        extrapolate: "clamp",
      });

      return (
        <View style={{ justifyContent: "center", paddingLeft: 20, width: 60 }}>
          <Animated.Text
            style={{ transform: [{ scale }], fontSize: 18, color: "#8E8E93" }}
          >
            ↩️
          </Animated.Text>
        </View>
      );
    };

    return (
      <Swipeable
        ref={(ref) => {
          swipeRefs.current[item._id] = ref;
        }}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={() => {
          setReplyingMessage(item);

          requestAnimationFrame(() => {
            swipeRefs.current[item._id]?.close();
          });
        }}
        friction={2}
        leftThreshold={40}
        overshootLeft={false}
      >
        <View
          style={{
            marginBottom,
            backgroundColor: isHighlighted
              ? "rgba(0, 132, 255, 0.15)"
              : "transparent",
            paddingVertical: isHighlighted ? 4 : 0,
            borderRadius: 8,
          }}
        >
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

            {/* Toàn bộ bong bóng tin nhắn (bao gồm cả phần reply và phần text chính) */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedMessageId(isSelected ? null : item._id)}
              style={[bubbleStyle, { flexDirection: "column" }]} // Thêm flexDirection để xếp dọc từ trên xuống
            >
              {/* 1. KHU VỰC TIN NHẮN BỊ REPLY NẰM Ở TRÊN CÙNG */}
              {item.reply_to && repliedMessage && (
                <TouchableOpacity // 👇 Đổi View thành TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => scrollToMessage(item.reply_to)}
                  style={{
                    backgroundColor: isMe
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(0, 0, 0, 0.06)",
                    padding: 8,
                    borderRadius: 8,
                    marginBottom: 6,
                    borderLeftWidth: 3,
                    borderLeftColor: isMe ? "#FFFFFF" : "#0084FF",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: isMe ? "#FFFFFF" : "#0084FF",
                      marginBottom: 2,
                    }}
                    numberOfLines={1}
                  >
                    {repliedMessage.sender_id === userId ? "Bạn" : name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: isMe ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)",
                    }}
                    numberOfLines={2}
                  >
                    {repliedMessage.content}
                  </Text>
                </TouchableOpacity> // 👇 Đóng thẻ
              )}
              {/* 2. KHU VỰC TIN NHẮN CHÍNH NẰM Ở DƯỚI */}
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
      </Swipeable>
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ImageBackground
        source={chatWallpaper ? { uri: chatWallpaper } : undefined} // Nếu có ảnh thì truyền uri, không thì undefined
        style={{ flex: 1 }}
        imageStyle={{ resizeMode: "cover" }} // Giúp ảnh nền trải đều không bị méo
        // backgroundColor={chatWallpaper ? 'transparent' : '#FFF'} // Nếu không có ảnh thì lấy nền trắng mặc định
      >
        {chatWallpaper && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "rgba(0,0,0,0.05)" },
            ]}
            pointerEvents="none"
          />
        )}

        <Pressable
          style={{ flex: 1 }}
          delayLongPress={3000}
          onLongPress={() => {
            Vibration.vibrate(50);
            handleSelectWallpaper();
          }}
        >
          {(aiSummary || isSummarizing) && (
            <View style={styles.aiBannerContainer}>
              <View style={styles.aiBannerHeader}>
                <Text style={styles.aiBannerTitle}>✨ Tóm tắt bằng AI</Text>

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
            keyboardDismissMode="on-drag" // Vuốt là ẩn bàn phím (iOS cực mượt)
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
            onScrollToIndexFailed={(info) => {
              // Nếu FlatList chưa kịp render UI của tin nhắn đó, ta delay nhẹ 500ms rồi ép nó cuộn lại
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({
                  index: info.index,
                  animated: true,
                  viewPosition: 0.5,
                });
              });
            }}
          />
          {replyingMessage && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#F2F2F7", // Nền xám nhẹ sang trọng
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderTopWidth: 1,
                borderTopColor: "#E5E5EA",
              }}
            >
              {/* Vạch màu xanh bên trái chỉ định đây là khung reply */}
              <View
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: "#0084FF",
                  paddingLeft: 8,
                  flex: 1,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "600", color: "#0084FF" }}
                >
                  Đang trả lời{" "}
                  {replyingMessage.sender_id === userId ? "chính mình" : name}
                </Text>
                {/* Giới hạn text dài quá thì hiện dấu 3 chấm */}
                <Text
                  style={{ fontSize: 13, color: "#3A3A3C", marginTop: 2 }}
                  numberOfLines={1}
                >
                  {replyingMessage.content}
                </Text>
              </View>

              {/* Nút hủy bỏ hành động reply */}
              <TouchableOpacity
                style={{ padding: 5 }}
                onPress={() => setReplyingMessage(null)}
              >
                <Text
                  style={{ fontSize: 16, color: "#8E8E93", fontWeight: "bold" }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
        </Pressable>
      </ImageBackground>
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

  //

  messageWrapper: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  messageWrapperLeft: {
    justifyContent: "flex-start",
  },
  messageWrapperRight: {
    justifyContent: "flex-end",
  },

  bubbleLeft: {
    backgroundColor: "#E4E6EB", // Màu xám (nhắn đến)
    borderBottomLeftRadius: 5,
  },
  bubbleRight: {
    backgroundColor: "#0084FF", // Màu xanh Messenger (mình nhắn)
    borderBottomRightRadius: 5,
  },

  messageTextLeft: {
    color: "#000000",
  },
  messageTextRight: {
    color: "#FFFFFF",
  },

  /* --- STYLES CHO KHU VỰC REPLY --- */
  replyContainer: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 5,
    borderLeftWidth: 3, // Tạo cái vạch dọc bên trái chuẩn style quote
  },
  replyContainerLeft: {
    backgroundColor: "rgba(0, 0, 0, 0.05)", // Nền xám mờ
    borderLeftColor: "#A0A0A0", // Vạch xám
  },
  replyContainerRight: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Nền trắng mờ để nổi trên nền xanh
    borderLeftColor: "#FFFFFF", // Vạch trắng
  },
  replyName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
    color: "inherit", // Tự ăn theo màu chữ bên dưới
  },
  replyContent: {
    fontSize: 13,
    opacity: 0.8, // Làm chữ mờ đi một chút cho đỡ giành giật sự chú ý với tin nhắn chính
  },
});
