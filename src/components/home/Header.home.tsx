import { StyleSheet, Text, View } from "react-native";

interface Props {
  address?: string;
}
export const HeaderComponent = (props: Props) => {
  const { address } = props;

  return (
    <View style={styles.container}>
      <View style={styles.redBox}>
        <Text style={styles.text}>📍 Địa chỉ giao hàng:</Text>
        <Text style={styles.addressText} numberOfLines={2}>
          {address}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  redBox: {
    margin: 8,

    justifyContent: "center",
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    color: "red",
  },
  addressText: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 4,
    color: "black",
  },
});
