import { Image } from "expo-image";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";

import bg from "@/src/assets/images/mapp.jpg";
import { useCurrentApp } from "@/src/context/app.context";

const { width, height } = Dimensions.get("window");

interface Props {
  onFinish: (address: string) => void;
}

export default function ShopeeFoodLoading({ onFinish }: Props) {
  const imageScale = useRef(new Animated.Value(0.5)).current;
  const [loading, setLoading] = useState(true);
  const { address, setAddress, setHasLocation } = useCurrentApp();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Hiệu ứng vòng tròn radar quét sóng xung quanh
  const radarAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Chạy hiệu ứng radar lặp đi lặp lại
    Animated.loop(
      Animated.sequence([
        Animated.timing(radarAnim, {
          toValue: 1.3,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(radarAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    (async () => {
      let finalAddress = "Không thể xác định địa chỉ";
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          finalAddress = "Chưa cấp quyền vị trí!";
          setAddress(finalAddress);
          setTimeout(() => startExitAnimation(finalAddress), 2000);
          return;
        }

        Animated.spring(imageScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }).start();

        let currentLocation = await Location.getCurrentPositionAsync({});
        setAddress("Đang phân tích địa chỉ...");

        let geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode.length > 0) {
          const place = geocode[0];
          finalAddress = [
            place.streetNumber,
            place.street,
            place.subregion,
            place.city,
            place.region,
          ]
            .filter(Boolean)
            .join(", ");

          setAddress(`📍 ${finalAddress}`);
        } else {
          setAddress(`📍 ${finalAddress}`);
        }

        setHasLocation(true);
        setLoading(false);

        setTimeout(() => {
          startExitAnimation(finalAddress);
        }, 1500);
      } catch (error) {
        console.error(error);
        finalAddress = "Lỗi khi lấy vị trí!";
        setAddress(finalAddress);
        setTimeout(() => startExitAnimation(finalAddress), 1500);
      }
    })();
  }, []);

  const startExitAnimation = (fetchedAddress: string) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish(fetchedAddress);
    });
  };

  return (
    <Animated.View
      style={[
        styles.overlay,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* GIẢI PHÁP THAY THẾ: Dùng ảnh mờ làm nền thay cho MapView thật */}
      <Image source={bg} style={styles.mapBackground} blurRadius={2} />
      <View style={styles.darkOverlay} />

      <View style={styles.centerContainer}>
        {/* Vòng tròn Radar phát sóng hiệu ứng */}
        <Animated.View
          style={[
            styles.radarGlow,
            {
              transform: [{ scale: radarAnim }],
              opacity: radarAnim.interpolate({
                inputRange: [1, 1.3],
                outputRange: [0.6, 0],
              }),
            },
          ]}
        />

        {/* Khối tròn hiển thị Avatar/Logo Map ở giữa */}
        <View style={styles.imageWrapper}>
          <Animated.View style={{ transform: [{ scale: imageScale }] }}>
            <Image source={bg} style={styles.image} contentFit="cover" />
          </Animated.View>
        </View>

        {/* Trạng thái Loading Loading */}
        {loading && (
          <ActivityIndicator
            size="small"
            color="#ee4d2d"
            style={{ marginTop: 15 }}
          />
        )}
      </View>

      {/* Thanh hiển thị địa chỉ chữ */}
      <View style={styles.addressBar}>
        <Text style={styles.addressText} numberOfLines={2}>
          {address}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  mapBackground: {
    position: "absolute",
    width: width,
    height: height,
    opacity: 0.4, // Làm mờ nhẹ hình nền
  },
  darkOverlay: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  radarGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#ee4d2d",
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 6,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  addressBar: {
    position: "absolute",
    bottom: "15%", // Đưa chữ xuống dưới cho thoáng giao diện
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  addressText: {
    color: "#222",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
  },
});
