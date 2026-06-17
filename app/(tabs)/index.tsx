import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "@/services/firebaseConfig";

export default function HomeScreen() {
  async function sair() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras</Text>

      <Text style={styles.text}>
        Login realizado com sucesso! Aqui ficará a lista inteligente de compras.
      </Text>

      <TouchableOpacity style={styles.button} onPress={sair}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563EB",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});