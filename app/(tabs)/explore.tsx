import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MarketFlow</Text>
      <Text style={styles.text}>Tela de apoio do aplicativo.</Text>
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