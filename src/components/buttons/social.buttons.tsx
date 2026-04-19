import fb from "@/src/assets/auth/facebook.png";
import gg from "@/src/assets/auth/google.png";
import { Image, StyleSheet, View } from "react-native";
import TextBetewwenLine from "../text/text.bettewnline";
import ShareButton from "./share_button";

const styles = StyleSheet.create({
  welcomeBtn: {
    gap: 30,
    flex: 0.4,
  },
});

const SocailButtons = () => {
  return (
    <>
      <View style={styles.welcomeBtn}>
        <TextBetewwenLine textColor="black" title="Đăng nhập với" />
        <View style={{ gap: 10 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 30,
            }}
          >
            <View>
              <ShareButton
                title="Google"
                onPress={() => alert("Hi")}
                textStyle={{ textTransform: "none" }}
                pressStyle={{ alignSelf: "flex-start" }}
                btnStyle={{
                  justifyContent: "center",
                  paddingHorizontal: 20,
                  backgroundColor: "white",
                  borderRadius: 30,
                }}
                icon={<Image source={gg} />}
              />
            </View>
            <View>
              <ShareButton
                title="FaceBook"
                onPress={() => alert("Hi")}
                textStyle={{ textTransform: "none" }}
                pressStyle={{ alignSelf: "flex-start" }}
                btnStyle={{
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderRadius: 30,
                }}
                icon={<Image source={fb} />}
              />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default SocailButtons;
