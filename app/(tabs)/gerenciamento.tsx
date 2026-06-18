import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth } from "@/services/firebaseConfig";
import {
  atualizarQuantidade,
  observarProdutos,
  removerProduto,
  type Produto,
} from "@/services/produtoService";

export default function GerenciamentoScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setCarregando(false);
      return;
    }

    const unsubscribe = observarProdutos(user.uid, (lista) => {
      setProdutos(lista);
      setCarregando(false);
    });

    return unsubscribe;
  }, [user]);

  function handleAdicionar() {
    Alert.alert("Adicionar produto", "A tela de cadastro de produto ainda precisa ser integrada pelo grupo.");
  }

  const totalGeral = useMemo(() => {
    return produtos.reduce(
      (total, item) => total + item.valorUnitario * item.quantidade,
      0
    );
  }, [produtos]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>LISTA INTELIGENTE</Text>
        <Text style={styles.title}>Sua compra</Text>
      </View>

      {carregando ? (
        <View style={styles.center}>
          <ActivityIndicator color="#111" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={produtos.length ? styles.list : styles.emptyList}
          data={produtos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={null}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.imagemUrl ? (
                <Image source={{ uri: item.imagemUrl }} style={styles.image} />
              ) : (
                <View style={styles.emptyImage}>
                  <Ionicons name="image-outline" size={20} color="#777" />
                </View>
              )}

              <View style={styles.info}>
                <View style={styles.topRow}>
                  <View style={styles.nameBlock}>
                    <Text numberOfLines={1} style={styles.name}>
                      {item.nome}
                    </Text>
                    <Text style={styles.price}>
                      {formatarMoeda(item.valorUnitario)} - un
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => removerProduto(item.id)}
                    style={styles.delete}
                  >
                    <Ionicons name="trash-outline" size={18} color="#777" />
                  </Pressable>
                </View>

                <View style={styles.bottomRow}>
                  <View style={styles.counter}>
                    <Pressable
                      disabled={item.quantidade <= 1}
                      onPress={() =>
                        atualizarQuantidade(item, item.quantidade - 1)
                      }
                      style={styles.counterButton}
                    >
                      <Ionicons
                        name="remove"
                        size={18}
                        color={item.quantidade <= 1 ? "#c9c3ba" : "#111"}
                      />
                    </Pressable>

                    <Text style={styles.qty}>{item.quantidade}</Text>

                    <Pressable
                      onPress={() =>
                        atualizarQuantidade(item, item.quantidade + 1)
                      }
                      style={styles.counterButton}
                    >
                      <Ionicons name="add" size={18} color="#111" />
                    </Pressable>
                  </View>

                  <Text style={styles.total}>
                    {formatarMoeda(item.valorUnitario * item.quantidade)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <View>
          <Text style={styles.label}>TOTAL - {produtos.length} ITENS</Text>
          <Text style={styles.footerTotal}>{formatarMoeda(totalGeral)}</Text>
        </View>

        <Pressable onPress={handleAdicionar} style={styles.addButton}>
          <Ionicons name="camera-outline" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbfaf7",
  },
  header: {
    paddingTop: 18,
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd8cf",
  },
  label: {
    fontSize: 10,
    color: "#777",
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    color: "#111",
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 110,
  },
  item: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd8cf",
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#f0ede7",
  },
  emptyImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd8cf",
    backgroundColor: "#f0ede7",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  price: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: {
    width: 84,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd8cf",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },
  counterButton: {
    width: 28,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  total: {
    fontSize: 17,
    color: "#111",
  },
  delete: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#ddd8cf",
    backgroundColor: "#fbfaf7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    minWidth: 116,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  footerTotal: {
    fontSize: 24,
    color: "#111",
    marginTop: 2,
  },
});

