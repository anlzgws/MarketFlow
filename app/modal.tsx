import { StyleSheet, Text, View } from "react-native";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MarketFlow</Text>
      <Text style={styles.text}>Tela modal do aplicativo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563EB",
    marginBottom: 12,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
  },
});