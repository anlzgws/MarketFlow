import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "@/services/firebaseConfig";
import type {
  ItemProduto,
  NovoItemProduto,
  SalvarItemListaResponse,
} from "@/types/produto";

const ITENS_LISTA_COLLECTION = "itens_lista";

const getProdutoImageBlob = async (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      resolve(xhr.response as Blob);
    };

    xhr.onerror = () => {
      reject(new Error("Falha ao converter imagem local para upload."));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send();
  });
};

export const uploadProdutoImage = async (uri: string): Promise<string> => {
  try {
    const blob = await getProdutoImageBlob(uri);
    const imageRef = ref(storage, `produtos/${Date.now()}.jpg`);

    await uploadBytes(imageRef, blob, {
      contentType: "image/jpeg",
    });

    return await getDownloadURL(imageRef);
  } catch {
    throw new Error("Falha ao fazer upload da imagem do produto.");
  }
};

export const salvarItemNaLista = async (
  item: NovoItemProduto,
  imageUri?: string
): Promise<SalvarItemListaResponse> => {
  try {
    let imagemUrl = item.imagemUrl;

    if (imageUri) {
      imagemUrl = await uploadProdutoImage(imageUri);
    }

    const itemParaSalvar: Omit<ItemProduto, "id"> = {
      nome: item.nome.trim(),
      valorUnitario: item.valorUnitario,
      quantidade: item.quantidade,
      ...(imagemUrl ? { imagemUrl } : {}),
      criadoEm: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, ITENS_LISTA_COLLECTION),
      itemParaSalvar
    );

    return {
      id: docRef.id,
      item: {
        ...itemParaSalvar,
        id: docRef.id,
      },
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Falha ao fazer upload da imagem do produto."
    ) {
      throw error;
    }

    throw new Error("Erro ao salvar o item na lista. Verifique sua conexão.");
  }
};
