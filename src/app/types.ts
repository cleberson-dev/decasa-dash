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
  quantidadeApresentacao: number;
  detalhe: string;
  cnp: string;
  produtoLiberado: boolean;
  categoria: {
    id: number;
    descricao?: string;
    departamento?: {
      id?: number;
      descricao: string;
    }
  };
  modelo: {
    id: number;
    descricao?: string;
    marca?: {
      id?: number;
      descricao: string;
    }
  };
  manualInstrucao?: string;
  videoDemonstrativo?: string;
  pesoGrama?: number;
  alturaCm?: number;
  larguraCm?: number;
  profundidadeCm?: number;
  unidadeMedidaProduto?: {
    id: number;
    descricao?: string;
    sigla?: string;
  }
}

export type Fornecedor = {
  id?: number; 
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
  usuario?: {
    id: number;
  };
  ufRg?: {
    id: number;
    nome?: string;
  };
  inscricaoEstadual: string;
  categoriasFornecidas: {
    id: number;
    descricao?: string;
    departamento?: {
      id: number;
      descricao?: string;
    }
  }[];
  departamentosFornecidos: {
    id: number;
    descricao?: string;
  }[];
  nomeFantasia: string;
  razaoSocial: string;
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

export type UnidadeMedida = {
  id: number;
  descricao: string;
}

export type CompraMaterial = {
  id?: number;
  lojista: {
    id: number;
  };
  fornecedor: {
    id: number;
  };
  valor: number;
  detalhesCompras: {
    id?: number;
    produto: {
      id: number;
    };
    valor: number;
    quantidade: number;
  }[];
  dataCompra?: string;
}