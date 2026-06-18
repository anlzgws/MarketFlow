import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "@/services/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.replace("/(tabs)" as any);
    } catch (error) {
      Alert.alert("Erro no login", "E-mail ou senha inválidos.");
    }
  }

  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      {!isMobile && (
        <View style={styles.leftSide}>
          <Text style={styles.topText}>MARKTEFLOW</Text>

          <View>
            <Text style={styles.heroTitle}>Compre com{"\n"}consciência.</Text>
            <Text style={styles.heroDescription}>
              Fotografe o produto na gôndola, registre preço e{"\n"}
              quantidade, e confira no caixa sem surpresas.
            </Text>
          </View>

          <Text style={styles.footer}>© 2026</Text>
        </View>
      )}

      <View style={[styles.rightSide, isMobile && styles.mobileRightSide]}>
        {isMobile && <Text style={styles.mobileTopText}>MARKTEFLOW</Text>}

        <View style={styles.form}>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua lista de compras.</Text>

          <Text style={styles.label}>E-MAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="voce@exemplo.com"
            placeholderTextColor="#8A8A8A"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#8A8A8A"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />



<TouchableOpacity style={styles.button} onPress={handleLogin}>
  <Text style={styles.buttonText}>Entrar</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => router.push("/cadastro" as any)}>
  <Text style={styles.createAccount}>
    Não tem conta? Criar conta
  </Text>
</TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8F7F4",
  },
  mobileContainer: {
    flexDirection: "column",
  },
  leftSide: {
    flex: 1,
    backgroundColor: "#F4F0EA",
    paddingHorizontal: 46,
    paddingVertical: 48,
    justifyContent: "space-between",
  },
  topText: {
    fontSize: 13,
    letterSpacing: 2,
    color: "#4B4B4B",
  },
  heroTitle: {
    fontSize: 58,
    lineHeight: 62,
    fontWeight: "400",
    color: "#1C1814",
    marginBottom: 28,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 25,
    color: "#4B4B4B",
  },
  footer: {
    fontSize: 12,
    color: "#4B4B4B",
  },
  rightSide: {
    flex: 1,
    backgroundColor: "#FAFAF9",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  mobileRightSide: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  mobileTopText: {
    position: "absolute",
    top: 50,
    left: 24,
    fontSize: 12,
    letterSpacing: 2,
    color: "#4B4B4B",
  },
  form: {
    width: "100%",
    maxWidth: 385,
  },
  title: {
    fontSize: 32,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 34,
  },
  label: {
    fontSize: 12,
    color: "#4B5563",
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    height: 42,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D8D3CC",
    borderRadius: 11,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111",
    marginBottom: 19,
  },
  button: {
    height: 40,
    backgroundColor: "#1D1A16",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 28,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  createAccount: {
    textAlign: "center",
    fontSize: 14,
    color: "#3F3A34",
  },
});