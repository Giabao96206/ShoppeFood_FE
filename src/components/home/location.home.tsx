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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import bg from "@/src/assets/images/mapp.jpg";
import { Image } from "expo-image";
const { width, height } = Dimensions.get("window");
interface Props {
  onFinish: (address: string) => void;
}

export default function ShopeeFoodLoading({ onFinish }: Props) {
  const imageScale = useRef(new Animated.Value(0.5)).current;
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [address, setAddress] = useState<string>("Đang tìm vị trí của bạn...");

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      let finalAddress = "Không thể xác định địa chỉ"; // Biến tạm để lưu địa chỉ
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
        setLocation(currentLocation.coords);
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
      {location ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker coordinate={location} />
        </MapView>
      ) : (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ee4d2d" />
        </View>
      )}
      <View style={styles.addressBar}>
        <View style={styles.imageWrapper}>
          <Animated.View style={{ transform: [{ scale: imageScale }] }}>
            <Image source={bg} style={styles.image} contentFit="cover" />
          </Animated.View>
          <Text style={styles.addressText} numberOfLines={2}>
            {address}
          </Text>
        </View>
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
  },
  map: {
    width: width,
    height: height,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addressBar: {
    position: "absolute",
    top: "30%",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    alignItems: "center",
  },
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  image: {
    width: 180,
    height: 180,
    borderRadius: 100,
  },

  addressText: {
    position: "absolute",
    color: "black",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 20,
    width: "100%",
    paddingHorizontal: 10,
  },
});
