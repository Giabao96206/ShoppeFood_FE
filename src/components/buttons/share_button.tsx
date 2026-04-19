import { APP_COLOR } from "@/src/utils/APP_COLOR";

import { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

const styles = StyleSheet.create({
  btnContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: APP_COLOR.ORANGE,
    borderColor: "red",
  },
});

interface IProps {
  title: string;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
  pressStyle?: StyleProp<ViewStyle>;
  btnStyle?: StyleProp<ViewStyle>;
  icon?: ReactNode;
  isLoading?: boolean;
}
const ShareButton = (props: IProps) => {
  const {
    title,
    onPress,
    textStyle,
    pressStyle,
    btnStyle,
    icon,
    isLoading = false,
  } = props;
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed === true || isLoading ? 0.5 : 1,
          alignSelf: "flex-start", //fit-content
        },
        pressStyle,
      ]}
      disabled={isLoading}
      onPress={onPress}
    >
      <View style={[styles.btnContainer, btnStyle]}>
        {isLoading && <ActivityIndicator />}
        {icon}
        <Text style={textStyle}>{title}</Text>
      </View>
    </Pressable>
  );
};

export default ShareButton;
