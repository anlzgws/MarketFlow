import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSalvarItemNaLista } from "@/hooks/useSalvarItemNaLista";

function CameraIcon({ color = "#6f6a63" }: { color?: string }) {
  return (
    <View style={[styles.cameraIcon, { borderColor: color }]}>
      <View style={[styles.cameraTop, { backgroundColor: color }]} />
      <View style={[styles.cameraLens, { borderColor: color }]} />
    </View>
  );
}

function SuccessIcon() {
  return (
    <View style={styles.successIcon}>
      <Text style={styles.successIconText}>OK</Text>
    </View>
  );
}

export default function CadastrarProduto() {
  const [produto, setProduto] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [successVisible, setSuccessVisible] = useState(false);

  const { salvar, loading, error, reset } = useSalvarItemNaLista();
  const router = useRouter();

  const aplicarMascaraMoeda = (text: string) => {
    const apenasNumeros = text.replace(/\D/g, "");
    if (!apenasNumeros) return "";

    const valorFormatado = (Number(apenasNumeros) / 100).toFixed(2);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(valorFormatado));
  };

  const valorNumerico = useMemo(() => {
    const apenasNumeros = valorUnitario.replace(/\D/g, "");
    return apenasNumeros ? Number(apenasNumeros) / 100 : 0;
  }, [valorUnitario]);

  const formValido = produto.trim().length > 0 && valorNumerico > 0 && Math.floor(quantidade) > 0;

  const selecionarImagem = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à câmera para tirar a foto do produto."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const limparFormulario = () => {
    setProduto("");
    setValorUnitario("");
    setQuantidade(1);
    setImageUri(undefined);
    reset();
  };

  const handleSalvar = async () => {
    if (!formValido) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe o produto, o valor unitário e uma quantidade válida."
      );
      return;
    }

    const result = await salvar(
      {
        nome: produto,
        valorUnitario: valorNumerico,
        quantidade,
      },
      imageUri
    );

    if (result || result === undefined) {
      setSuccessVisible(true);
      limparFormulario();
    }
  };

  const handleCancelar = () => {
    limparFormulario();
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>NOVO ITEM</Text>
              <Text style={styles.title}>Adicionar à lista</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.content}>
              {imageUri ? (
                <View style={[styles.imagePicker, styles.imagePickerWithImage]}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    <View style={styles.actionButtonsContainer}>
                      <Pressable
                        disabled={loading}
                        onPress={selecionarImagem}
                        style={({ pressed }) => [
                          styles.actionButton,
                          pressed ? styles.pressed : undefined,
                        ]}
                      >
                        <CameraIcon color="#fff" />
                        <Text style={styles.actionButtonText}>Trocar foto</Text>
                      </Pressable>

                      <Pressable
                        disabled={loading}
                        onPress={() => setImageUri(undefined)}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.deleteButton,
                          pressed ? styles.pressed : undefined,
                        ]}
                      >
                        <Text style={styles.deleteButtonText}>Excluir</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  disabled={loading}
                  onPress={selecionarImagem}
                  style={({ pressed }) => [
                    styles.imagePicker,
                    pressed && !loading ? styles.pressed : undefined,
                  ]}
                >
                  <View style={styles.emptyImageState}>
                    <CameraIcon />
                    <Text style={styles.imageTitle}>Tirar foto do produto</Text>
                    <Text style={styles.imageHint}>
                      a imagem será adaptada automaticamente
                    </Text>
                  </View>
                </Pressable>
              )}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>PRODUTO</Text>
                <TextInput
                  editable={!loading}
                  placeholder="Ex.: Café 500g"
                  placeholderTextColor="#9b9690"
                  value={produto}
                  onChangeText={setProduto}
                  style={styles.input}
                />
              </View>

              <View style={styles.row}>
                <View style={styles.priceColumn}>
                  <Text style={styles.label}>VALOR UNIT. (R$)</Text>
                  <TextInput
                    editable={!loading}
                    keyboardType="numeric"
                    placeholder="R$ 0,00"
                    placeholderTextColor="#9b9690"
                    value={valorUnitario}
                    onChangeText={(text) => setValorUnitario(aplicarMascaraMoeda(text))}
                    style={styles.input}
                  />
                </View>

                <View style={styles.quantityColumn}>
                  <Text style={styles.label}>QUANTIDADE</Text>
                  <View style={styles.stepper}>
                    <Pressable
                      accessibilityRole="button"
                      disabled={loading || quantidade <= 1}
                      onPress={() => setQuantidade((current) => Math.max(1, current - 1))}
                      style={styles.stepperButton}
                    >
                      <Text style={styles.stepperIcon}>-</Text>
                    </Pressable>
                    <Text style={styles.quantityValue}>{quantidade}</Text>
                    <Pressable
                      accessibilityRole="button"
                      disabled={loading}
                      onPress={() => setQuantidade((current) => current + 1)}
                      style={styles.stepperButton}
                    >
                      <Text style={styles.stepperIcon}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <View style={styles.footer}>
              <Pressable
                disabled={loading}
                onPress={handleCancelar}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && !loading ? styles.pressed : undefined,
                ]}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                disabled={loading}
                onPress={handleSalvar}
                style={({ pressed }) => [
                  styles.primaryButton,
                  (!formValido || loading) && styles.primaryButtonDisabled,
                  pressed && !loading ? styles.pressed : undefined,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Salvar item</Text>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent visible={successVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <SuccessIcon />
            <Text style={styles.successTitle}>Item salvo</Text>
            <Text style={styles.successMessage}>
              O produto foi adicionado à lista com sucesso.
            </Text>
            
            {/* CORREÇÃO 2: Ao clicar em Ok, fecha o modal e vai para o gerenciamento */}
            <Pressable
              onPress={() => {
                setSuccessVisible(false);
                router.replace("/gerenciamento");
              }}
              style={styles.successButton}
            >
              <Text style={styles.successButtonText}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#b9b6b0",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 448,
    borderRadius: 14,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 20,
  },
  eyebrow: {
    color: "#77716a",
    fontSize: 11,
    letterSpacing: 1.8,
  },
  title: {
    marginTop: 4,
    color: "#211d19",
    fontFamily: Platform.select({ ios: "Georgia", default: "serif" }),
    fontSize: 22,
    lineHeight: 28,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd8d2",
  },
  content: {
    padding: 20,
    gap: 16,
  },
  imagePicker: {
    minHeight: 120,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ded8d2",
    borderRadius: 14,
    borderStyle: "dashed",
    backgroundColor: "#fbfaf8",
  },
  imagePickerWithImage: {
    borderStyle: "solid",
    padding: 0,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImageState: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
  },
  imageTitle: {
    marginTop: 8,
    color: "#5f5a53",
    fontSize: 14,
    fontWeight: "500",
  },
  imageHint: {
    marginTop: 2,
    textAlign: "center",
    color: "#77716a",
    fontSize: 11,
  },
  previewImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: 10,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "rgba(33, 29, 25, 0.82)",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "rgba(179, 38, 30, 0.9)",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: "#706a63",
    fontSize: 11,
    fontWeight: "600",
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#ded8d2",
    borderRadius: 11,
    paddingHorizontal: 14,
    color: "#211d19",
    fontSize: 14,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  priceColumn: {
    flex: 1,
    gap: 6,
  },
  quantityColumn: {
    flex: 1,
    gap: 6,
  },
  stepper: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ded8d2",
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  stepperButton: {
    height: 42,
    width: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    minWidth: 34,
    textAlign: "center",
    color: "#211d19",
    fontSize: 14,
  },
  errorText: {
    color: "#b3261e",
    fontSize: 13,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd8d2",
    padding: 20,
  },
  secondaryButton: {
    height: 42,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ded8d2",
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  primaryButton: {
    height: 42,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#211d19",
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  secondaryButtonText: {
    color: "#211d19",
    fontSize: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
  },
  cameraIcon: {
    height: 16,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 4,
  },
  cameraTop: {
    position: "absolute",
    top: -4,
    height: 4,
    width: 8,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  cameraLens: {
    height: 6,
    width: 6,
    borderWidth: 1.5,
    borderRadius: 999,
  },
  stepperIcon: {
    color: "#5b554d",
    fontSize: 20,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    padding: 24,
  },
  successModal: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 24,
  },
  successIcon: {
    height: 46,
    width: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#2f8f5b",
  },
  successIconText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  successTitle: {
    marginTop: 10,
    color: "#211d19",
    fontSize: 20,
    fontWeight: "700",
  },
  successMessage: {
    marginTop: 8,
    textAlign: "center",
    color: "#6f6a63",
    fontSize: 14,
    lineHeight: 20,
  },
  successButton: {
    marginTop: 20,
    height: 42,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#211d19",
  },
  successButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});