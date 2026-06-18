import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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

  const valorNumerico = useMemo(() => {
    const normalizedValue = valorUnitario.replace(/\./g, "").replace(",", ".");
    return Number(normalizedValue);
  }, [valorUnitario]);

  const formValido = produto.trim().length > 0 && valorNumerico > 0 && quantidade > 0;

  const selecionarImagem = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissao necessaria",
        "Permita o acesso as fotos para adicionar a imagem do produto."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        "Campos obrigatorios",
        "Informe o produto, o valor unitario e uma quantidade valida."
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

    if (result) {
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
              <Text style={styles.title}>Adicionar a lista</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.content}>
              <Pressable
                accessibilityRole="button"
                disabled={loading}
                onPress={selecionarImagem}
                style={({ pressed }) => [
                  styles.imagePicker,
                  imageUri ? styles.imagePickerWithImage : undefined,
                  pressed && !loading ? styles.pressed : undefined,
                ]}
              >
                {imageUri ? (
                  <>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    <View style={styles.changeImageBadge}>
                      <CameraIcon color="#fff" />
                      <Text style={styles.changeImageText}>Trocar foto</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyImageState}>
                    <CameraIcon />
                    <Text style={styles.imageTitle}>Tirar foto do produto</Text>
                    <Text style={styles.imageHint}>
                      a imagem sera comprimida automaticamente
                    </Text>
                  </View>
                )}
              </Pressable>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>PRODUTO</Text>
                <TextInput
                  editable={!loading}
                  placeholder="Ex.: Cafe 500g"
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
                    keyboardType="decimal-pad"
                    placeholder="0,00"
                    placeholderTextColor="#9b9690"
                    value={valorUnitario}
                    onChangeText={setValorUnitario}
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
              O produto foi adicionado a lista com sucesso.
            </Text>
            <Pressable
              onPress={() => setSuccessVisible(false)}
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
    padding: 20,
  },
  card: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 448,
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 26,
    paddingTop: 24,
  },
  eyebrow: {
    color: "#77716a",
    fontSize: 11,
    letterSpacing: 1.8,
  },
  title: {
    marginTop: 6,
    color: "#211d19",
    fontFamily: Platform.select({ ios: "Georgia", default: "serif" }),
    fontSize: 25,
    lineHeight: 31,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd8d2",
  },
  content: {
    padding: 24,
    gap: 22,
  },
  imagePicker: {
    minHeight: 298,
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
  },
  emptyImageState: {
    alignItems: "center",
    paddingHorizontal: 18,
  },
  imageTitle: {
    marginTop: 10,
    color: "#5f5a53",
    fontSize: 14,
  },
  imageHint: {
    marginTop: 4,
    textAlign: "center",
    color: "#77716a",
    fontSize: 12,
  },
  previewImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  changeImageBadge: {
    position: "absolute",
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "rgba(33, 29, 25, 0.78)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  changeImageText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#706a63",
    fontSize: 12,
  },
  input: {
    minHeight: 44,
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
    gap: 8,
  },
  quantityColumn: {
    flex: 1,
    gap: 8,
  },
  stepper: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ded8d2",
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  stepperButton: {
    height: 44,
    width: 44,
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
    padding: 24,
  },
  secondaryButton: {
    minHeight: 42,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ded8d2",
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  primaryButton: {
    minHeight: 42,
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
    height: 19,
    width: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 4,
  },
  cameraTop: {
    position: "absolute",
    top: -5,
    height: 5,
    width: 10,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  cameraLens: {
    height: 8,
    width: 8,
    borderWidth: 2,
    borderRadius: 999,
  },
  stepperIcon: {
    color: "#5b554d",
    fontSize: 22,
    lineHeight: 24,
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
    minHeight: 42,
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
