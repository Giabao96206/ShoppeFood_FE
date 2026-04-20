import bg from "@/src/assets/auth/cute.jpg";
import ShareButton from "@/src/components/buttons/share_button";
import SocailButtons from "@/src/components/buttons/social.buttons";
import ShareInput from "@/src/components/inputs/share.inputs";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { register } from "@/src/utils/service";
import { ValiDateCheckSingUp } from "@/src/utils/validate.schema";
import { ImageBackground } from "expo-image";
import { Link, router } from "expo-router";
import { Formik } from "formik";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";

// import { router } from "expo-router";
// import { Link } from "expo-router";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  inputGroups: {
    padding: 5,
    gap: 10,
    marginHorizontal: 20,
  },

  text: {
    fontSize: 18,
  },
  input: {
    borderColor: "#d0d0d0",
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
export default function SingUp() {
  const HandleSignUp = async (
    name: string,
    email: string,
    password: string,
  ) => {
    try {
      const res = await register(name, email, password);
      console.log(name, email, password, res);
      if (res.data) {
        router.replace({
          pathname: "/(auth)/verify",
          params: { email: email },
        });
      } else {
        const m = Array.isArray(res.message) ? res.message[0] : res.message;
        Toast.show(m, {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.ORANGE,
          textColor: "white",
          position: Toast.positions.TOP,
          shadow: true,
          opacity: 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground style={{ flex: 1 }} source={bg} blurRadius={5}>
      <SafeAreaView style={{ flex: 1 }}>
        <Formik
          validationSchema={ValiDateCheckSingUp}
          initialValues={{ name: "", email: "", password: "" }}
          onSubmit={(values) =>
            HandleSignUp(values.name, values.email, values.password)
          }
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={styles.container}>
              <View style={{ marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    marginVertical: 30,
                  }}
                >
                  Đăng kí tài khoản
                </Text>
              </View>
              <ShareInput
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={errors.name}
                title="Họ và Tên"
              />
              <ShareInput
                title="Email"
                keyBoardType="email-address"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                error={errors.email}
              />
              <ShareInput
                title="Mật Khẩu"
                secureTextEntry={true}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                error={errors.password}
              />
              <View style={{ marginVertical: 10 }}> </View>
              <ShareButton
                title="Đăng Ký"
                onPress={handleSubmit as any}
                textStyle={{ textTransform: "uppercase", color: "white" }}
                pressStyle={{ alignSelf: "stretch" }}
                btnStyle={{
                  justifyContent: "center",
                  borderRadius: 30,
                  marginHorizontal: 30,
                  paddingVertical: 10,
                  backgroundColor: APP_COLOR.ORANGE,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                  marginVertical: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "black",
                  }}
                >
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

              <SocailButtons />
            </View>
          )}
        </Formik>
      </SafeAreaView>
    </ImageBackground>
  );
}
