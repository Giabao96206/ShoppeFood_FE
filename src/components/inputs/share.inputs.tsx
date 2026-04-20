import { APP_COLOR } from "@/src/utils/APP_COLOR";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const styles = StyleSheet.create({
  inputGroups: {
    padding: 5,
    gap: 10,
    marginHorizontal: 20,
  },

  text: {
    fontSize: 18,
  },
  input: {
    borderColor: APP_COLOR.GRAY,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  eye: {
    position: "absolute",
    right: 10,
    top: 8,
    // color: APP_COLOR.GRAY,
  },
});

interface Iprops {
  title?: string;
  keyBoardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  value: string | undefined;
  setValue?: (value: any) => void;
  valueHold?: string;
  onChangeText?: any;
  onBlur?: any;
  error?: any;
}
export default function ShareInput(props: Iprops) {
  const {
    title,
    keyBoardType,
    secureTextEntry = false,
    value,
    // setValue,
    valueHold,
    onChangeText,
    onBlur,
    error,
  } = props;

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [isShowPassWord, setIsShowPassWord] = useState<boolean>(false);
  return (
    <View style={styles.inputGroups}>
      {title && <Text style={styles.text}>{title}</Text>}
      <View>
        <TextInput
          placeholder={valueHold}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={(e) => {
            if (onBlur) onBlur(e);
            setIsFocus(false);
          }}
          onChangeText={onChangeText}
          style={[
            styles.input,
            { borderColor: isFocus ? APP_COLOR.ORANGE : APP_COLOR.GRAY },
          ]}
          keyboardType={keyBoardType}
          secureTextEntry={secureTextEntry && !isShowPassWord}
        />
        {error && <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>}
        {secureTextEntry && (
          <FontAwesome5
            name={isShowPassWord ? "eye-slash" : "eye"}
            size={20}
            color={"black"}
            style={styles.eye}
            onPress={() => setIsShowPassWord((value) => !value)}
          />
        )}
      </View>
    </View>
  );
}
