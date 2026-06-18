import type { Timestamp } from "firebase/firestore";

export type ItemProduto = {
  id: string;
  nome: string;
  valorUnitario: number;
  quantidade: number;
  imagemUrl?: string;
  criadoEm: Timestamp;
};

export type NovoItemProduto = Omit<ItemProduto, "id" | "criadoEm">;

export type SalvarItemListaResponse = {
  id: string;
  item: ItemProduto;
};
