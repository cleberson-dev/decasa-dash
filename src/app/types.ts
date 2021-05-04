type IdentifiableObject = {
  id: number;
  nome: string;
}

export type Produto = {
  id: number;
  nome: string;
  foto: string;
  categoria: IdentifiableObject;
  departamento: IdentifiableObject;
  modelo: IdentifiableObject;
  marca: IdentifiableObject;
  quantidadeApresentacao: number;
  detalhe: string;
  manualInstrucao: string;
  videoDemonstrativo: string;
  cnp: string;
  pesoGrama?: number;
  dimensoes?: {
    alturaCm?: number;
    larguraCm?: number;
    profundidadeCm?: number;
  }
  liberado?: boolean;
  unidadeMedida: {
    descricao: string;
    sigla: string;
  }
}

export type ProdutoLojista = Produto & {
  preco?: number;
}

export type ResumidoProdutoLojista = Omit<
  ProdutoLojista,
  "unidadeMedida" | "liberado" | "dimensoes" | "pesoGrama" | "cnp" |
  "videoDemonstrativo" | "manualInstrucao" | "detalhe" | "quantidadeApresentacao" |
  "descricao"
>;