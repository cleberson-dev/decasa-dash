type IdentifiableObject = {
  id?: number;
  nome: string;
}

export type Colaborador = {
  id?: number;
  nome: string;
  resumo: string;
  descricao: string;
  foto?: string;
}

export type Produto = {
  id?: string;
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
  unidadeMedida?: {
    descricao: string;
    sigla: string;
  }
}

export type Fornecedor = {
  id?: number; 
  nome: string;
  cnpj: string;
  logradouro: string;
  numero: number;
  bairro: string;
  cep: string;
  pontoReferencia?: string;
  celular: string;
  telefone: string;
  email: string;
  rgRepresentante?: string;
  cpfRepresentante?: string;
  dataRg?: Date;
  municipioEndereco?: {
    id: number;
    nome?: string;
    ativo?: boolean;
  };
  usuario?: number;
  ufRg?: {
    id: number;
    nome: string;
  };
  estadoCivil?: {
    id: number;
    descricao?: string;
  };
  orgaoExpedidor?: {
    id: number;
    descricao?: string;
  };
}

export type ProdutoLojista = Produto & {
  preco?: number;
}

export type ResumidoProdutoLojista = Omit<
  ProdutoLojista,
  "liberado" | "dimensoes" | "pesoGrama" | "cnp" |
  "videoDemonstrativo" | "manualInstrucao" | "detalhe" | "quantidadeApresentacao" |
  "descricao"
>;

export type AddProductItem = ResumidoProdutoLojista & { selected?: boolean };