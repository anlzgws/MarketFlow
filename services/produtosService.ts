import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage, auth } from "@/services/firebaseConfig";
import type {
  ItemProduto,
  NovoItemProduto,
  SalvarItemListaResponse,
} from "@/types/produto";

const ITENS_LISTA_COLLECTION = "itens_lista";

const comTimeout = <T>(promise: Promise<T>, tempoMs = 12000, mensagemErro = "Tempo expirado"): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(mensagemErro)), tempoMs)
    ),
  ]);
};

const getProdutoImageBlob = async (uri: string): Promise<Blob> => {
  try {
    const response = await comTimeout(fetch(uri), 5000, "Falha ao ler o ficheiro da imagem local (Timeout).");
    return await response.blob();
  } catch (error) {
    console.error("Erro ao converter imagem local para Blob:", error);
    throw new Error(error instanceof Error ? error.message : "Falha ao converter imagem local.");
  }
};

export const uploadProdutoImage = async (uri: string): Promise<string> => {
  try {
    const blob = await getProdutoImageBlob(uri);
    const imageRef = ref(storage, `produtos/${Date.now()}.jpg`);

    console.log("[Firebase Storage] A enviar imagem...");
    await comTimeout(
      uploadBytes(imageRef, blob, { contentType: "image/jpeg" }),
      15000,
      "O upload da imagem demorou muito tempo. Verifique a ligação ou o Firebase Storage."
    );

    console.log("[Firebase Storage] A obter URL de download...");
    return await comTimeout(getDownloadURL(imageRef), 5000, "Falha ao obter URL da imagem guardada.");
  } catch (error) {
    console.error("Erro detalhado no upload para o Firebase Storage:", error);
    throw error;
  }
};

export const salvarItemNaLista = async (
  item: NovoItemProduto,
  imageUri?: string
): Promise<SalvarItemListaResponse> => {
  try {
    let imagemUrl = item.imagemUrl;

if (imageUri) {
  imagemUrl = imageUri;
}

    const userId = auth.currentUser?.uid;

    const itemParaSalvar: Omit<ItemProduto, "id"> & { userId?: string } = {
      nome: item.nome.trim(),
      valorUnitario: item.valorUnitario,
      quantidade: item.quantidade,
      userId,
      ...(imagemUrl ? { imagemUrl } : {}),
      criadoEm: Timestamp.now(),
    };

    console.log("[Firestore] A tentar gravar o documento...");
    
    const docRef = await addDoc(
  collection(db, ITENS_LISTA_COLLECTION),
  itemParaSalvar
);
    console.log("[Firestore] Gravado com sucesso! ID:", docRef.id);

    return {
      id: docRef.id,
      item: {
        ...itemParaSalvar,
        id: docRef.id,
      } as ItemProduto,
    };
  } catch (error) {
    console.error("Erro capturado no serviço:", error);
    throw error; 
  }
};