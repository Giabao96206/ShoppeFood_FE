import bg from "@/src/assets/auth/hinhnenverifyv2.webp";
import LoadingOverlay from "@/src/components/overlays/overlay";
import { APP_COLOR } from "@/src/utils/APP_COLOR";
import { resendcode, verifycode } from "@/src/utils/service";
import { ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-root-toast";
export default function VerifyCode() {
  const { email, isLogin } = useLocalSearchParams();

  const [isSubmitting, setSubmitting] = useState<boolean>(false);

  const [code, setcode] = useState<string>("");

  const otpref = useRef<OTPTextView>(null);

  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const HandleResendCodeTimeout = async (): Promise<void> => {
    if (countdown > 0) return;

    otpref?.current?.clear();

    const res = await resendcode(email as string);

    Toast.show(res.message as string, {
      duration: Toast.durations.SHORT,
      backgroundColor: APP_COLOR.ORANGE,
      textColor: "white",
      position: Toast.positions.TOP,
      shadow: true,
      opacity: 1,
    });

    setCountdown(60);
  };
  const verify = async () => {
    if (code && code.length === 6) {
      Keyboard.dismiss();
      setSubmitting(true);
      const res = await verifycode(email as string, code);
      setSubmitting(false);
      otpref?.current?.clear();
      if (res.data) {
        Toast.show("Kích hoạt tài khoản thành công", {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.ORANGE,
          textColor: "white",
          position: Toast.positions.TOP,
          shadow: true,
          opacity: 1,
        });
        if (isLogin) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } else {
        Toast.show(res.message as string, {
          duration: Toast.durations.SHORT,
          backgroundColor: APP_COLOR.ORANGE,
          textColor: "white",
          position: Toast.positions.TOP,
          shadow: true,
          opacity: 1,
        });
        setSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (code && code.length === 6) verify();
  }, [code]);

  const CodeTimeout = async () => {
    otpref?.current?.clear();

    const res = await resendcode(email as string);

    const m = res.message;

    Toast.show(m, {
      duration: Toast.durations.SHORT,
      backgroundColor: APP_COLOR.ORANGE,
      textColor: "white",
      position: Toast.positions.TOP,
      shadow: true,
      opacity: 1,
    });
  };
  return (
    <>
      <ImageBackground style={{ flex: 1 }} source={bg} blurRadius={5}>
        <View style={style.container}>
          <Text style={style.heading}>Xác thực tài khoản </Text>
          <Text style={{ marginVertical: 10, color: APP_COLOR.WHITE }}>
            Vui lòng nhập mã xác nhận được gửi từ email
            tranvangiabao96206@gmail.com
          </Text>

          <View style={{ marginVertical: 20 }}>
            <OTPTextView
              ref={otpref}
              autoFocus
              handleTextChange={setcode}
              inputCount={6}
              inputCellLength={1}
              tintColor={APP_COLOR.ORANGE}
              textInputStyle={{
                borderWidth: 1,
                borderColor: APP_COLOR.GRAY,
                borderBottomWidth: 1,
                borderRadius: 5,
                width: 45,
                // @ts-ignore:next-line
                color: APP_COLOR.ORANGE,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            <Text style={{ color: APP_COLOR.WHITE }}>Không nhận được mã </Text>

            <Text
              onPress={countdown > 0 ? undefined : HandleResendCodeTimeout}
              style={{
                textDecorationLine: "underline",
                color: countdown > 0 ? "gray" : APP_COLOR.WHITE,
              }}
            >
              {countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại"}
            </Text>
          </View>
        </View>
      </ImageBackground>
      {isSubmitting && <LoadingOverlay />}
    </>
  );
}

const style = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 20,
    color: "white",
  },
});
