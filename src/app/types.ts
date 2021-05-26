export type Colaborador = {
  id?: number;
  nome: string;
  resumo: string;
  descricao: string;
  foto?: string;
}

export type Produto = {
  id?: number;
  descricao: string;
  foto: string;
  categoria: {
    id?: number;
    descricao: string;
    departamento: {
      id?: number;
      descricao: string;
    }
  };
  modelo: {
    id?: number;
    descricao: string;
    marca: {
      id?: number;
      descricao: string;
    }
  };
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
  estoqueMinimo?: number;
}

export type ResumidoProdutoLojista = Omit<
  ProdutoLojista,
  "liberado" | "dimensoes" | "pesoGrama" | "cnp" |
  "videoDemonstrativo" | "manualInstrucao" | "detalhe" | "quantidadeApresentacao"
>;