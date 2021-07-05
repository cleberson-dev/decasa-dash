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

declare type ProdutoLojista = {
  id?: number;
  lojistaDTO: {
    id: number;
  };
  produto: Produto;
  valor: number;
  estoqueMinimo?: number;
};

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

declare type Usuario = {
  id: number;
  nome: string;
  cpf: string;
  senha: string;
  email: string;
  dataCadastro: string;
  ultimoAcesso: string;
  resetarSenha: boolean;
  bloqueado: boolean;
  dataBloqueio: string;
  origemCadastro: OrigemCadastro;
  perfisUsuario: PerfilUsuario[];
};

declare type PerfilUsuario = {
  id: number;
  perfil: Perfil;
  dataHabilitacao: string;
};

declare type Perfil = {
  id: number;
  nome: string;
  descricao: string;
};

declare type OrigemCadastro = {
  id: number;
  descricao: string;
};

declare type Lojista = {
  id: number;
  municipio: Municipio;
  estadoCivil: EstadoCivil;
  sexo: Sexo;
  orgaoExpedidor: OrgaoExpedidor;
  ufRg: Uf;
  usuario: Usuario;
  nome: string;
  cnpj: string;
  cpf: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  pontoReferencia: string;
  celular: string;
  telefone: string;
  email: string;
  dataCadastro: string;
  rg: string;
  dataRg: string;
  inscricaoEstadual: string;
};

declare type Municipio = {
  id: number;
  nome: string;
  codigoIbge: number;
  ativo: boolean;
  uf: Uf;
};

declare type Uf = {
  id: number;
  nome: string;
  sigla: string;
  pais: Pais;
};

declare type Pais = {
  id: number;
  nome: string;
  sigla: string;
  pais: Pais;
};

declare type EstadoCivil = {
  id: number;
  descricao: string;
};

declare type Sexo = {
  id: number;
  descricao: string;
};

declare type OrgaoExpedidor = {
  id: number;
  descricao: string;
};

declare type PaginationHeader = {
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  sort: {
    direction: string;
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    descending: boolean;
    ascending: boolean;
  }[];
  size: number;
  number: number;
};

declare type PaginatedResource<T> = PaginationHeader & { content: T[]; };
