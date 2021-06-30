import { Action, createReducer, on } from '@ngrx/store';
import * as ProdutosPlataformaActions from '../actions/produtos-plataforma.actions';


export interface ProdutosPlataformaState {
  pagination: {
    page: number;
    size: number;
    totalItems: number; 
  };
  category: number;
  data: ProdutoLojista[];
}

const initialState: ProdutosPlataformaState = {
  pagination: {
    page: 1,
    size: 10,
    totalItems: 0
  },
  category: 1,
  data: []
}

const produtosPlataformaReducer = createReducer(
  initialState,
  on(ProdutosPlataformaActions.fetch, (state, { payload }) => ({
    ...state,
    data: payload.content,
    pagination: {
      page: payload.number + 1,
      totalItems: payload.totalElements,
      size: payload.size
    }
  }))
);

export function reducer(state: ProdutosPlataformaState | undefined, action: Action) {
  return produtosPlataformaReducer(state, action);
}