import { ProdutosPlataformaState } from './reducers/produtos-plataforma.reducers';

export interface AppState {
  produtosPlataforma: ProdutosPlataformaState;
}

export const selectProdutosPlataforma = (state: AppState) => state.produtosPlataforma;