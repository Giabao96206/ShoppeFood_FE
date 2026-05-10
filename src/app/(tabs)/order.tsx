import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { CanCelOrder, GetOrderHistory } from "@/src/utils/service";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-root-toast";

export default function Order() {
  const [data, setData] = useState<IOrderHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetOrderHistory();

        if (res?.data) {
          setData(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const HanleCancel = async (OrderID: string) => {
    console.log(OrderID);
    const res = await CanCelOrder(OrderID);
    if (res.status === "200") {
      setData(data.filter((item) => item._id !== OrderID));
      Toast.show(res.message, {
        duration: Toast.durations.SHORT,
        backgroundColor: APP_COLOR.ORANGE,
        textColor: "white",
        position: Toast.positions.TOP,
        shadow: true,
        opacity: 1,
      });
    } else {
      console.log(res.message);
    }
  };
  const renderStatus = (status: string) => {
    switch (status) {
      case "Ordered":
        return {
          text: "Đã đặt hàng",
          bg: "#e8fff1",
          color: "#10b981",
          icon: "checkmark-circle",
          actions: [
            {
              text: "Huỷ đơn",
              type: "cancel",
              onPress: HanleCancel,
            },
            {
              text: "Liên hệ shop",
              onPress: HanleCancel,
              type: "contact",
            },
          ],
        };

      case "Shipping":
        return {
          text: "Đang giao",
          bg: "#fff7e8",
          color: "#10b981",
          icon: "bicycle",
          actions: [
            {
              text: "Theo dõi",
              onPress: HanleCancel,
              type: "tracking",
            },
            {
              text: "Đã nhận hàng",
              onPress: HanleCancel,
              type: "received",
            },
          ],
        };

      case "Delivered":
        return {
          text: "Đã giao",
          bg: "#e8fff1",
          color: "#10b981",
          icon: "checkmark-circle",
          actions: [
            {
              text: "Đánh giá",
              onPress: HanleCancel,
              type: "review",
            },
            {
              text: "Mua lại",
              onPress: HanleCancel,
              type: "buy_again",
            },
          ],
        };

      default:
        return {
          text: "Đã huỷ",
          bg: "#ffeaea",
          color: "#ef4444",
          icon: "close-circle",
          actions: [],
        };
    }
  };
  const renderItem = ({ item }: { item: IOrderHistory }) => {
    const status = renderStatus(item.status);

    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.shopRow}>
            <View style={styles.shopIcon}>
              <Ionicons name="restaurant" size={18} color="#fff" />
            </View>

            <View>
              <Text style={styles.shopName}>
                {item.restaurantName || "Nhà hàng"}
              </Text>
              <Text style={styles.orderId}>Mã đơn #{item._id}</Text>
            </View>
          </View>

          <View
            style={[styles.statusContainer, { backgroundColor: "#e8fff1" }]}
          >
            <Ionicons
              name={status.icon as any}
              size={14}
              color={status.color}
            />

            <Text style={[styles.statusText, { color: status.color }]}>
              {item.status}
            </Text>
          </View>
        </View>

        {/* FOOD */}
        <View style={styles.foodContainer}>
          <Image
            source={{
              uri:
                item.details[0]?.image ||
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
            }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          <View style={styles.foodInfo}>
            <Text numberOfLines={2} style={styles.foodName}>
              {item.details[0]?.title || "Món ăn"}
            </Text>

            <View style={styles.infoRow}>
              <Ionicons name="fast-food-outline" size={14} color="#999" />

              <Text style={styles.quantity}>{item.quantity || 1} món</Text>
            </View>

            <Text style={styles.price}>
              {item.totalPrice?.toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={14} color="#999" />
            <Text style={styles.time}>
              {new Date(item.createdAt).toLocaleString("vi-VN")}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            {status.actions.map((btn, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => btn.onPress(item._id)}
              >
                <Text style={styles.buttonText}>{btn.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Lịch sử đơn hàng</Text>

        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={70} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
            <Text style={styles.emptyText}>
              Các đơn hàng của bạn sẽ hiển thị tại đây
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },

  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",

    elevation: 2,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 10,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.06,
    shadowRadius: 10,

    elevation: 4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  shopIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#ff6b35",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  shopName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  orderId: {
    marginTop: 2,
    color: "#888",
    fontSize: 12,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,

    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  statusText: {
    fontWeight: "700",
    fontSize: 12,
  },

  foodContainer: {
    flexDirection: "row",
    marginTop: 18,
  },

  image: {
    width: 95,
    height: 95,
    borderRadius: 18,
    backgroundColor: "#eee",
  },

  foodInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },

  foodName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    lineHeight: 22,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  quantity: {
    fontSize: 13,
    color: "#777",
  },

  price: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ff6b35",
  },

  footer: {
    marginTop: 18,
    paddingTop: 14,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  time: {
    fontSize: 12,
    color: "#888",
  },

  button: {
    backgroundColor: "#ff6b35",
    maxWidth: 150,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  emptyBox: {
    marginTop: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "700",
    color: "#444",
  },

  emptyText: {
    marginTop: 6,
    color: "#888",
    fontSize: 14,
  },
});
