import { createAction, props } from "@ngrx/store";
import { ProdutoLojista } from "../../types";

type FetchPayload = {
  number: number;
  size: number;
  totalElements: number;
  content: ProdutoLojista[];
}

export const fetch = createAction(
  '[Produtos Plataforma] Fetch',
  props<{ payload: FetchPayload }>()
);