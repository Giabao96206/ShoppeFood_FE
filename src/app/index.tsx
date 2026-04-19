import ShareButton from "@/src/components/buttons/share_button";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import fb from "@/src/assets/auth/facebook.png";
import gg from "@/src/assets/auth/google.png";
import bg from "@/src/assets/auth/welcome-background.png";
import { ImageBackground } from "expo-image";
import { Link, Redirect, router } from "expo-router";
import TextBetewwenLine from "../components/text/text.bettewnline";
export default function Home_detail() {
  if (true) {
    return (
      <>
        <Redirect href="/(tabs)" />
      </>
    );
  }
  return (
    <ImageBackground style={{ flex: 1 }} source={bg}>
      <LinearGradient
        style={{
          flex: 1,
        }}
        colors={["transparent", "#191B2F"]}
        locations={[0.2, 0.8]}
      >
        <View style={styles.container}>
          <View style={styles.welcomeText}>
            <Text style={styles.heading}>WellCome To</Text>
            <Text style={styles.body}>Shoppe Food</Text>
            <Text style={styles.footer}>Nền tảng giao đồ ăn trực tuyến</Text>
          </View>
          <View style={styles.welcomeBtn}>
            <TextBetewwenLine title="Đăng nhập với" />
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
              <View style={{ marginTop: 10 }}>
                <ShareButton
                  title="Đăng Nhập với Email"
                  onPress={() => router.navigate("/(auth)/login")}
                  textStyle={{ textTransform: "none", color: "white" }}
                  pressStyle={{ alignSelf: "stretch" }}
                  btnStyle={{
                    justifyContent: "center",
                    borderRadius: 30,
                    marginHorizontal: 30,
                    paddingVertical: 10,
                    backgroundColor: "#2c2c2c",

                    borderColor: "#505050",
                    borderWidth: 1,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Text style={{ textAlign: "center", color: "white" }}>
                  Chưa có tài khoản mật khẩu
                </Text>
                <Link href={"/(auth)/SignUp"}>
                  <Text
                    style={{ color: "blue", textDecorationLine: "underline" }}
                  >
                    Đăng ký
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  welcomeText: {
    flex: 0.6,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },
  welcomeBtn: {
    gap: 30,
    flex: 0.4,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
  },
  body: {
    fontSize: 30,
    color: "orange",
    marginVertical: 10,
  },
  footer: {},
});
