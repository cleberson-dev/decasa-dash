import { createAction, props } from "@ngrx/store";
import { IProdutoLojista } from "../../components/produto-lojista/produto-lojista.component";

type FetchPayload = {
  number: number;
  size: number;
  totalElements: number;
  content: IProdutoLojista[];
}

export const fetch = createAction(
  '[Produtos Plataforma] Fetch',
  props<{ payload: FetchPayload }>()
);