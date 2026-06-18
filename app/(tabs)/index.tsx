import { Link, router } from "expo-router";
import { signOut } from "firebase/auth";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { auth } from "@/services/firebaseConfig";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function HomeScreen() {
  async function sair() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">MarketFlow</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Bem-vindo</ThemedText>
        <ThemedText>
          Esta é a tela inicial do app. Use os botões abaixo para navegar.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/cadastrarProduto" style={{ alignSelf: "center" }}>
          <ThemedText type="link">Abrir tela de captura</ThemedText>
        </Link>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity onPress={sair} style={styles.button}>
          <ThemedText style={styles.buttonText}>Sair</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 40,
  },
  titleContainer: {
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: "center",
    gap: 12,
  },
  stepContainer: {
    paddingVertical: 16,
    gap: 12,
  },
  button: {
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
