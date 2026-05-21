import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { getFoodAI } from "@/src/utils/service";

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
    <View style={styles.container}>
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

      {/* FLOAT BUTTON */}
      {!isOpen && (
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={styles.floatingButton}
        >
          <Text style={styles.floatingText}>💬</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatBoxAI;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "10%",
    right: 20,
    zIndex: 999,
  },

  chatBox: {
    width: 340,
    height: 500,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
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

  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  floatingText: {
    fontSize: 28,
    color: "#fff",
  },
});
