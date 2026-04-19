import { StyleSheet, Text, View } from "react-native";

interface IProps {
  name: string;
}

export default function CollectionHome(props: IProps) {
  const { name } = props;
  return (
    <View style={styles.container}>
      <Text> {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderWidth: 4,
    borderColor: "green",
    backgroundColor: "#fff",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
