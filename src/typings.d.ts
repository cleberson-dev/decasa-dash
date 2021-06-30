declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var tinymce: any;

declare var echarts: any;

declare type Colaborador = {
  id?: number;
  nome: string;
  resumo: string;
  descricao: string;
  foto?: string;
}

declare type Produto = {
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

declare type Fornecedor = {
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

declare type ProdutoLojista = Produto & {
  preco?: number;
  estoqueMinimo?: number;
}

declare type ResumidoProdutoLojista = Omit<
  ProdutoLojista,
  "liberado" | "dimensoes" | "pesoGrama" | "cnp" |
  "videoDemonstrativo" | "manualInstrucao" | "detalhe" | "quantidadeApresentacao"
>;

declare type UnidadeMedida = {
  id: number;
  descricao: string;
}

declare type CompraMaterial = {
  id?: number;
  lojista: {
    id: number;
  };
  fornecedor: Fornecedor;
  valor: number;
  dataCompra?: string;
  detalhesCompras: {
    id?: number;
    produto: Produto;
    valor: number;
    quantidade: number;
  }[];
}

declare type Cotacao = {
  id: number;
  preco: number;
  detalhePedido: {
    produto: Produto;
    quantidade: number;
  };
  fornecedor: Fornecedor;
  dataCotacao?: string;
}

declare type Pedido = {
  id: number;
  lojista: {
    id: number;
  };
  detalhesPedidos: {
    id?: number;
    produto: {
      id: number;
    };
    quantidade: number;
  }[];
  fornecedores: {
    id: number;
  }[];
}