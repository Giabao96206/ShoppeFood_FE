import { Text, View } from "react-native";

type Props = {
  title: string;
  textColor?: "white" | "black";
};
export default function TextBetewwenLine(props: Props) {
  const { title, textColor = "white" } = props;
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 15 }}>
      <View
        style={{
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          paddingHorizontal: 15,
        }}
      ></View>

      <Text
        style={{
          textAlign: "center",
          position: "relative",
          top: "50%",
          color: textColor,
        }}
      >
        {title}
      </Text>

      <View
        style={{
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          paddingHorizontal: 15,
        }}
      ></View>
    </View>
  );
}
