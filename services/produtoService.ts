import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebaseConfig";

export type Produto = {
  id: string;
  userId: string;
  nome: string;
  imagemUrl?: string;
  valorUnitario: number;
  quantidade: number;
  total?: number;
};

export function observarProdutos(
  userId: string,
  callback: (produtos: Produto[]) => void
) {
  const produtosRef = collection(db, "produtos");
  const consulta = query(produtosRef, where("userId", "==", userId));

  return onSnapshot(consulta, (snapshot) => {
    const produtos = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Produto[];

    callback(produtos);
  });
}

export async function atualizarQuantidade(produto: Produto, quantidade: number) {
  const novaQuantidade = Math.max(1, quantidade);
  const total = produto.valorUnitario * novaQuantidade;

  return updateDoc(doc(db, "produtos", produto.id), {
    quantidade: novaQuantidade,
    total,
  });
}

export async function removerProduto(produtoId: string) {
  return deleteDoc(doc(db, "produtos", produtoId));
}
