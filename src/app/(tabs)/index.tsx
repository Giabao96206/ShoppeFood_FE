import CusTomFlashList from "@/src/components/CustomFlashList/CustomFlasList";
import CollectionHome from "@/src/components/home/collection.home";
import { HeaderComponent } from "@/src/components/home/Header.home";
import ShopeeFoodLoading from "@/src/components/home/location.home";
import SearchHome from "@/src/components/home/search.home";
import TopListHome from "@/src/components/home/top.list.home";
import { useCurrentApp } from "@/src/context/app.context";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSocket } from "../socket";

interface IData {
  key: number;
  name: string;
  description: string;
  refAPI: string;
}
const Home = () => {
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const { address, setAddress, hasLocation } = useCurrentApp();
  const [newMessageAlert, setNewMessageAlert] = useState<string | null>(null);
  const socket = getSocket();

  socket.on("receive_new_message", (message) => {
    setNewMessageAlert("Bạn có tin nhắn mới");

    // tự ẩn sau 2s
    setTimeout(() => {
      setNewMessageAlert(null);
    }, 2000);
  });

  const handleLocationDone = (fetchedAddress: string) => {
    setAddress(fetchedAddress);
    setShowLoading(false);
  };
  const data: IData[] = [
    {
      key: 1,
      name: "Top Quán Rating 5* tuần này",
      description: "Gợi ý Quán Rating 5* tuần này",
      refAPI: "topRating",
    },
    {
      key: 2,
      name: "Quán Mới Lên Sàn",
      description: "Đề cử quán Mới Lên Sàn",
      refAPI: "topRating",
    },
    {
      key: 3,
      name: "Ăn Thỏa Thích, Freeship 0Đ",
      description: "Ăn Thỏa Thích, Freeship 0Đ",
      refAPI: "topRating",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        {showLoading && !hasLocation ? (
          <ShopeeFoodLoading onFinish={handleLocationDone} />
        ) : (
          <>
            {newMessageAlert && (
              <View
                style={{
                  position: "absolute",
                  top: 50,
                  alignSelf: "center",
                  backgroundColor: "#000",
                  padding: 10,
                  borderRadius: 10,
                  zIndex: 999,
                }}
              >
                <Text style={{ color: "white" }}>{newMessageAlert}</Text>
              </View>
            )}
            <CusTomFlashList
              data={data}
              TopListElementComponent={<TopListHome />}
              HeaderComponent={<HeaderComponent address={address} />}
              StickyElementComponent={<SearchHome />}
              renderItem={(item) => (
                <CollectionHome
                  name={item.name}
                  description={item.description}
                  refAPI={item.refAPI}
                />
              )}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
