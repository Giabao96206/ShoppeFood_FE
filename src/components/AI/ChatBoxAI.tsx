import { getFoodAI } from "@/src/utils/service";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions, // Thêm Dimensions để lấy kích thước màn hình
    KeyboardAvoidingView,
    PanResponder,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

// Lấy kích thước màn hình chuẩn của thiết bị
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_SIZE = 60;
const PADDING = 16; // Khoảng cách cách viền màn hình khi hút vào

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

const ChatBoxAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Chào bạn! Mình là AI của ShopeeFood. Bạn đang thèm món gì?",
      sender: "ai",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // --- HỆ THỐNG KÉO THẢ & HÚT NAM CHÂM (MESSENGER STYLE) ---
  // Vị trí xuất hiện ban đầu (Góc dưới bên phải màn hình)
  const initialX = SCREEN_WIDTH - BUTTON_SIZE - PADDING;
  const initialY = SCREEN_HEIGHT * 0.7;

  const pan = useRef(
    new Animated.ValueXY({ x: initialX, y: initialY }),
  ).current;
  const offset = useRef({ x: initialX, y: initialY });

  useEffect(() => {
    const listenerId = pan.addListener((value) => {
      offset.current = value;
    });
    return () => {
      pan.removeListener(listenerId);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Chỉ nhận diện kéo khi di chuyển ngón tay quá 5 pixel
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({ x: offset.current.x, y: offset.current.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }, // Để false để đồng bộ mượt với PanResponder vị trí liên tục
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();

        // 1. Tính toán vị trí biên X (Hút vào Trái hoặc Phải)
        const currentX = offset.current.x;
        const leftSnapX = PADDING;
        const rightSnapX = SCREEN_WIDTH - BUTTON_SIZE - PADDING;
        const targetX =
          currentX + BUTTON_SIZE / 2 < SCREEN_WIDTH / 2
            ? leftSnapX
            : rightSnapX;

        // 2. Giới hạn biên Y (Không cho bay mất lên thanh thông báo hoặc xuống đáy loa)
        const currentY = offset.current.y;
        const minY = 60; // Tránh Tai thỏ / Dynamic Island
        const maxY = SCREEN_HEIGHT - BUTTON_SIZE - 80; // Tránh thanh điều hướng đáy suốt
        const targetY = Math.max(minY, Math.min(maxY, currentY));

        // 3. Thực hiện cú búng mượt mà dính vào tường
        Animated.spring(pan, {
          toValue: { x: targetX, y: targetY },
          bounciness: 8, // Độ nẩy nhẹ khi va vào tường cạnh màn hình
          speed: 12,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const responseData = await getFoodAI(currentMessage);
      let aiReplyText = "Xin lỗi, mình không tìm thấy món nào phù hợp.";

      if (responseData && responseData.data && responseData.data.length > 0) {
        aiReplyText =
          "Mình tìm thấy vài món đúng gu của bạn nè:\n\n" +
          responseData.data
            .map(
              (food: any, index: number) =>
                `${index + 1}. ${food.title} (${food.basePrice}đ)`,
            )
            .join("\n");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiReplyText,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("Lỗi AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Ui da, AI đang bận chút rồi 😢",
          sender: "ai",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}

      {isOpen && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.chatBox}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trợ lý Ẩm thực AI 🤖</Text>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={styles.closeBtn}>×</Text>
            </TouchableOpacity>
          </View>

          {/* MESSAGES */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={{ padding: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.message,
                  msg.sender === "user" ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === "user"
                      ? styles.userMessageText
                      : styles.aiMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}

            {isLoading && (
              <View style={[styles.message, styles.aiMessage]}>
                <ActivityIndicator size="small" color="#f97316" />
              </View>
            )}
          </ScrollView>

          {/* INPUT */}
          <View style={styles.inputContainer}>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Bạn thèm ăn gì..."
              placeholderTextColor="#999"
              style={styles.input}
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              style={[
                styles.sendButton,
                (!inputValue.trim() || isLoading) && {
                  backgroundColor: "#ccc",
                },
              ]}
            >
              <Text style={styles.sendText}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* 3. NÚT TRÒN BẤM: Chỉ cái này di chuyển và nhận tương tác vuốt kéo */}
      {!isOpen && (
        <Animated.View
          style={[
            styles.floatingContainer,
            { transform: pan.getTranslateTransform() },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            onPress={() => setIsOpen(true)}
            style={styles.floatingButton}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingText}>💬</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

export default ChatBoxAI;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 9998,
  },

  // Khung chứa nút tròn kéo thả
  floatingContainer: {
    position: "absolute",
    top: 0, // Dùng hệ tọa độ gốc top-left kết hợp transform để mượt hoàn hảo
    left: 0,
    zIndex: 9999,
  },

  floatingButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  floatingText: {
    fontSize: 28,
    color: "#fff",
  },

  // Hộp Chatbox cố định vị trí lý tưởng (Chính giữa - cận dưới màn hình) giống chuẩn App lớn
  chatBox: {
    position: "absolute",
    bottom: 50, // Cố định khoảng cách vừa vặn với tay bấm, không lo bị đẩy lên trời
    left: (SCREEN_WIDTH - 340) / 2, // Tự động căn giữa màn hình theo chiều ngang bất kể điện thoại to hay nhỏ
    width: 340,
    height: 500,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 9999,
  },

  header: {
    backgroundColor: "#f97316",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  closeBtn: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  messagesContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#f97316",
    borderBottomRightRadius: 4,
  },

  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },

  userMessageText: {
    color: "#fff",
  },

  aiMessageText: {
    color: "#222",
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 999,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#000",
  },

  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 999,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  sendText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
