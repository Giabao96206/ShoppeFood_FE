import { RouteProp } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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

// 1. Định nghĩa kiểu dữ liệu cho Params nhận được từ Navigation
type RootStackParamList = {
  Chat: { name: string }; // Cần khớp với tên route và params bạn đã truyền
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

// 2. Định nghĩa kiểu dữ liệu cho một tin nhắn
interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "them";
}

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const [inputText, setInputText] = useState<string>("");

  // 3. Dữ liệu tin nhắn giả (Mock Data)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", text: `Chào bạn! Mình là ${name}.`, sender: "them" },
    { id: "2", text: "Chào cậu, dạo này khỏe không?", sender: "me" },
    { id: "3", text: "Mình vẫn khỏe, cảm ơn cậu nhé!", sender: "them" },
  ]);

  // Hàm xử lý gửi tin nhắn
  const handleSend = () => {
    if (inputText.trim() === "") return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "me",
    };

    // Thêm tin nhắn mới vào mảng hiện tại
    setMessages([...messages, newMessage]);
    setInputText("");
  };

  // Hàm render giao diện từng bong bóng chat (Chat Bubble)
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.sender === "me";

    return (
      <View
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowThem,
        ]}
      >
        {/* Hiển thị Avatar nếu là tin nhắn của người kia */}
        {!isMe && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
        )}

        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
        >
          <Text
            style={[styles.messageText, isMe ? styles.textMe : styles.textThem]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // Dùng 'padding' cho iOS và tùy chỉnh hoặc để trống cho Android
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Thay đổi số này nếu đang dùng Header (vd: 90)
    >
      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        // Thêm thuộc tính này nếu bạn muốn list luôn cuộn xuống dưới cùng khi có tin nhắn mới
        // inverted={false}
      />

      {/* Khu vực nhập tin nhắn */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// 4. CSS / Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // Màu nền nhẹ nhàng giống app chat thật
  },
  listContent: {
    padding: 15,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-end",
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageRowThem: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleMe: {
    backgroundColor: "#007AFF", // Màu xanh iMessage
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: "#E5E5EA", // Màu xám nhạt
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  textMe: {
    color: "#fff",
  },
  textThem: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    alignItems: "center",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#A1C6EA", // Đổi màu mờ đi khi không có text
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
