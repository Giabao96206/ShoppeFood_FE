import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useCurrentApp } from "../context/app.context";
import { connectSocket } from "./socket";

import notifee, {
    AndroidImportance,
    AndroidStyle,
} from "@notifee/react-native";
// Cấu hình cách hiển thị thông báo khi người dùng đang MỞ APP (Foreground)
// Cấu hình cách hiển thị thông báo khi người dùng đang MỞ APP (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Cho phép hiển thị cảnh báo
    shouldPlaySound: true, // Phát âm thanh
    shouldSetBadge: false, // Không set số lượng thông báo ở icon app
    // 👇 BỔ SUNG 2 DÒNG NÀY ĐỂ VỪA LÒNG TYPESCRIPT 👇
    shouldShowBanner: true, // Hiển thị banner thả xuống (thường dùng cho iOS/Android đời mới)
    shouldShowList: true, // Đưa thông báo vào danh sách Notification Center khi kéo màn hình xuống
  }),
});

interface IData {
  name: string;
  content: string;
  conversation_id: string;
  avatar: string;
}
const AlerSocket = () => {
  const { appState, setLastMessgae } = useCurrentApp();

  // ===================== XIN QUYỀN THÔNG BÁO =====================
  // ===================== XIN QUYỀN THÔNG BÁO =====================
  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("messages", {
          name: "Tin nhắn mới",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#0084FF",
        });
      }

      // 👇 SỬA Ở ĐÂY: Sử dụng destructuring { status } để lấy thẳng quyền ra
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        // 👇 SỬA Ở ĐÂY TIẾP: Destructuring { status } khi request quyền
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Người dùng từ chối cấp quyền thông báo!");
        return;
      }
    };

    registerForPushNotifications();
  }, []);

  // ===================== SOCKET NHẬN TIN NHẮN =====================
  useEffect(() => {
    if (!appState?.user?._id) return;
    const socket = connectSocket(appState.access_token);
    if (!socket) return;

    const handleNewMessage = async (message: any) => {
      const data: IData = message._doc || message;

      // 1. Tạo Kênh thông báo (Notification Channel) cho Android (Nếu chưa có)
      const channelId = await notifee.createChannel({
        id: "chat_messages",
        name: "Tin nhắn phòng chat",
        importance: AndroidImportance.HIGH,
      });

      // 2. Hiển thị thông báo đẹp mắt bằng Notifee
      await notifee.displayNotification({
        title: data.name, // Tên người gửi
        body: data.content || "Bạn có một tin nhắn mới",

        // Lưu kèm data để khi bấm vào thông báo có thể điều hướng vào đúng phòng chat
        data: {
          conversationId: data.conversation_id,
        },

        android: {
          channelId,
          color: "#0084FF",

          largeIcon: data.avatar || "https://via.placeholder.com/150",

          style: {
            type: AndroidStyle.MESSAGING,
            person: {
              name: data.name,
              icon: data.avatar || "https://via.placeholder.com/150", // Ảnh avatar trong luồng chat
            },
            messages: [
              {
                text: data.content || "Bạn có một tin nhắn mới",
                timestamp: Date.now(),
              },
            ],
          },
          // Hành động khi nhấn vào thông báo (Mở app)
          pressAction: {
            id: "default",
          },
        },

        // 🛠️ CẤU HÌNH CHO IOS
        ios: {
          // Trên iOS, attachments sẽ tự thu nhỏ thành thumbnail bên phải cực đẹp
          attachments: data.avatar
            ? [
                {
                  url: data.avatar,
                  thumbnailHidden: false,
                },
              ]
            : [],
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
        },
      });
    };

    socket.on("receive_new_message", handleNewMessage);

    return () => {
      socket.off("receive_new_message", handleNewMessage);
    };
  }, [appState?.user._id]);

  // Vì dùng thông báo của hệ thống (Native UI) nên Component này không cần render giao diện gì cả
  return null;
};

export default AlerSocket;
