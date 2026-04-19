import { Image } from "expo-image";
import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

import bn1 from "@/src/assets/banner_image/banner/bn1.jpg";
import bn2 from "@/src/assets/banner_image/banner/bn2.jpg";
import bn3 from "@/src/assets/banner_image/banner/bn3.jpg";

function Banner() {
  const ref = React.useRef<ICarouselInstance>(null);
  const width = Dimensions.get("window").width;
  const progress = useSharedValue<number>(0);

  const sliders = [
    { id: 1, image: bn1 },
    { id: 2, image: bn2 },
    { id: 3, image: bn3 },
  ];
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={ref}
        width={width}
        height={width / 4}
        data={sliders}
        onProgressChange={progress}
        autoPlay
        autoPlayInterval={5000}
        loop
        renderItem={({ item, index }) => (
          <Image
            style={{ width: width, height: width / 3.7, resizeMode: "cover" }}
            source={item.image}
          />
        )}
      />
      <Pagination.Custom
        progress={progress}
        data={sliders}
        dotStyle={{
          backgroundColor: "rgba(0,0,0,0.2)",
          borderRadius: 50,
          width: 5,
          height: 5,
        }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
}
export default Banner;
