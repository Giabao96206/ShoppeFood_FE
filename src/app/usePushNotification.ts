import notifee, {
    AndroidImportance,
    AndroidStyle,
} from "@notifee/react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { PushToken } from "../utils/service";

// 1. TÊN TÁC VỤ NGẦM (BACKGROUND TASK)
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND_NOTIFICATION_TASK";

// 2. ĐỊNH NGHĨA TRẠM THU SÓNG KHI APP BỊ TẮT (BACKGROUND/KILLED STATE)
TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error }: any) => {
    if (error) {
      console.error("Lỗi tác vụ ngầm:", error);
      return;
    }

    if (data) {
      // Lấy cục data mà Node.js gửi qua server Expo
      const { notification } = data;
      const customData = notification?.data;

      if (customData) {
        // Gọi Notifee hiển thị giao diện Messenger ngay cả khi tắt app
        await displayBeautifulNotification(customData);
      }
    }
  },
);

// Đăng ký tác vụ ngầm với hệ thống Expo
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

// 3. HÀM VẼ GIAO DIỆN THÔNG BÁO ĐẸP KIỂU MESSENGER (DÙNG CHUNG)
async function displayBeautifulNotification(data: any) {
  const channelId = await notifee.createChannel({
    id: "chat_messages",
    name: "Tin nhắn phòng chat",
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: data.name,
    body: data.content || "Bạn có một tin nhắn mới",
    data: { conversationId: data.conversationId },
    android: {
      channelId,
      color: "#0084FF",
      largeIcon: data.avatar || "https://via.placeholder.com/150",
      style: {
        type: AndroidStyle.MESSAGING,
        person: {
          name: data.name,
          icon: data.avatar || "https://via.placeholder.com/150",
        },
        messages: [
          {
            text: data.content || "Bạn có một tin nhắn mới",
            timestamp: Date.now(),
          },
        ],
      },
      pressAction: { id: "default" },
    },
    ios: {
      attachments: data.avatar
        ? [{ url: data.avatar, thumbnailHidden: false }]
        : [],
    },
  });
}

// 4. CUSTOM HOOK CHÍNH ĐỂ GỌI TRONG APP
export function usePushNotification(userId: string | null) {
  const notificationListener = useRef<any>();

  useEffect(() => {
    if (!userId) return;

    // Hàm xin quyền và lấy Token gửi lên Backend
    const registerForPushNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Người dùng từ chối quyền thông báo!");
        return;
      }

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        Constants.easConfig?.projectId;

      try {
        const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
          .data;
        console.log("Token của thiết bị này là:", token);

        // LÀM MÓC XÍCH: Gọi API gửi token này lên cho Node.js lưu lại
        await PushToken(token);
      } catch (err) {
        console.error("Lỗi lấy hoặc gửi Token:", err);
      }
    };

    registerForPushNotifications();

    // 5. LẮNG NGHE KHI APP ĐANG MỞ (FOREGROUND STATE)
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        // Khi app đang mở, ta chặn không cho Expo hiện thông báo mặc định
        await Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: false,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: false,
            shouldShowList: false,
          }),
        });

        // Lấy data từ Node.js truyền xuống
        const customData = notification.request.content.data;
        // Ép Notifee hiện giao diện đẹp lên thay thế
        await displayBeautifulNotification(customData);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
    };
  }, [userId]);
}
