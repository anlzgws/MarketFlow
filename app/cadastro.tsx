import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "@/services/firebaseConfig";

export default function CadastroScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleCadastro() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      router.replace("/(tabs)" as any);
    } catch (error) {
      Alert.alert("Erro no cadastro", "Não foi possível criar a conta.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Comece a montar sua lista em segundos.</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF9",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  form: {
    width: "100%",
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    marginBottom: 12,
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
  link: {
    textAlign: "center",
    fontSize: 14,
    color: "#3F3A34",
  },
});