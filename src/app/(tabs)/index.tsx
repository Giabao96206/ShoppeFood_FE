import CusTomFlashList from "@/src/components/CustomFlashList/CustomFlasList";
import CollectionHome from "@/src/components/home/collection.home";
import { HeaderComponent } from "@/src/components/home/Header.home";
import ShopeeFoodLoading from "@/src/components/home/location.home";
import SearchHome from "@/src/components/home/search.home";
import TopListHome from "@/src/components/home/top.list.home";
import React, { useState } from "react";
import { View } from "react-native";

interface IData {
  key: number;
  name: string;
  ref: string;
}
const Home = () => {
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string>("");

  const handleLocationDone = (fetchedAddress: string) => {
    setAddress(fetchedAddress);
    setShowLoading(false);
  };
  const data: IData[] = [
    { key: 1, name: "Top Quán Rating 5* tuần này", ref: "" },
    { key: 2, name: "Quán Mới Lên Sàn", ref: "" },
    { key: 3, name: "Ăn Thỏa Thích, Freeship 0Đ", ref: "" },
  ];
  return (
    <>
      <View>
        {showLoading ? (
          <ShopeeFoodLoading onFinish={handleLocationDone} />
        ) : (
          <>
            <CusTomFlashList
              data={data}
              TopListElementComponent={<TopListHome />}
              HeaderComponent={<HeaderComponent address={address} />}
              StickyElementComponent={<SearchHome />}
              renderItem={(item) => <CollectionHome name={item.name} />}
            />
          </>
        )}
      </View>
    </>
  );
};

export default Home;
