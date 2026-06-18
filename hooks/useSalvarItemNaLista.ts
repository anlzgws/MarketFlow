import { useCallback, useState } from "react";

import { salvarItemNaLista } from "@/services/produtosService";
import type {
  NovoItemProduto,
  SalvarItemListaResponse,
} from "@/types/produto";

type UseSalvarItemNaListaState = {
  loading: boolean;
  error: string | null;
  success: boolean;
};

type UseSalvarItemNaListaReturn = UseSalvarItemNaListaState & {
  salvar: (
    item: NovoItemProduto,
    imageUri?: string
  ) => Promise<SalvarItemListaResponse | null>;
  reset: () => void;
};

export const useSalvarItemNaLista = (): UseSalvarItemNaListaReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const salvar = useCallback(
    async (
      item: NovoItemProduto,
      imageUri?: string
    ): Promise<SalvarItemListaResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const response = await salvarItemNaLista(item, imageUri);

        setSuccess(true);
        return response;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro inesperado ao salvar o item na lista.";

        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    success,
    salvar,
    reset,
  };
};
