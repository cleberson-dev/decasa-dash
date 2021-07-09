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

declare type DetalheCompra = {
  id?: number;
  produto: Produto;
  valor: number;
  quantidade: number;
};

declare type CompraMaterial = {
  id?: number;
  lojista: {
    id: number;
  };
  fornecedor: Fornecedor;
  valor: number;
  dataCompra?: string;
  detalhesCompras?: DetalheCompra[];
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
  dataCadastro: string;
  lojista: Partial<Lojista>;
  detalhesPedidos: {
    id?: number;
    produto: Partial<Produto>;
    quantidade: number;
  }[];
  fornecedores?: Partial<Fornecedor>[];
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
  razaoSocial: string;
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

declare type RecebimentoMaterial = {
  id: number;
  compraMaterial: CompraMaterial;
  dataRecebimento: string;
  numeroNf: number;
  dataNf: string;
  arquivoNf: string;
};

declare type Cor = {
  id: number;
  descricao: string;
};

declare type TipoPessoa = {
  id: number;
  descricao: string;
};

declare type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  celular: string;
  email: string;
  cpf: string;
  cnpj: string;
  rg: string;
  dataRg: string;
  dataCadastro: string;
  sexo: Sexo;
  estadoCivil: EstadoCivil;
  orgaoExpedidor: OrgaoExpedidor;
  ufRg: Uf;
  usuario: Usuario;
  tipoPessoa: TipoPessoa;
  creditoPre: number;
  dataNascimento: string;
};

declare type EnderecoCliente = {
  id: number;
  domicilio: boolean;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  complemento: string;
  pontoReferencia: string;
  latGraus: number;
  latMinutos: number;
  latSegundos: number;
  longGraus: number;
  longMinutos: number;
  longSegundos: number;
  municipio: Municipio;
  cliente: Cliente;
  clienteId?: number;
  ativo: boolean;
};

declare type NivelFormacao = {
  id: number;
  descricao: string;
};

declare type StatusCadastro = {
  id: number;
  descricao: string;
  ordem: number;
};

declare type BairroReferencia = {
  id: number;
  descricao: string;
  municipio: Municipio;
};

declare type Profissao = {
  id: number;
  descricao: string;
};

declare type ProfissaoPrestador = {
  id: number;
  experiencia: number;
  cursoTecnico: boolean;
  observacao: string;
  dataExclusao: string;
  codUsuarioExclusao: number;
  profissao: Profissao;
};

declare type Operadora = {
  id: number;
  descricao: string;
};

declare type TelefonePrestador = {
  id: number;
  telefone: string;
  operadora: Operadora;
  prestador: Prestador;
};

declare type MunicipioPrestador = {
  id: number;
  dataCadastro: string;
  ativo: boolean;
  municipio: Municipio;
  prestador: Prestador;
};

declare type Prestador = {
  id: number;
  nome: string;
  apelido: string;
  cnpj: string;
  cpf: string;
  rg: string;
  dataRg: string;
  pai: string;
  mae: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  pontoReferencia: string;
  habilitacao: string;
  email: string;
  disponivelFeriado: boolean;
  atendeDomicilio: boolean;
  naoAtendeDomicilio: boolean;
  smartphone: boolean;
  disponivelViagem: boolean;
  dataCadastro: string;
  ultimaAtualizacao: string;
  cadastroRepresentacao: boolean;
  dataNascimento: string;
  origemCadastro: OrigemCadastro;
  tipoPessoa: TipoPessoa;
  representante?: Prestador;
  sexo: Sexo;
  ufRg: Uf;
  usuario: Usuario;
  usuarioCadastro: Usuario;
  municipioEndereco: Municipio;
  orgaoExpedidor: OrgaoExpedidor;
  nivelFormacao: NivelFormacao;
  statusCadastro: StatusCadastro;
  bairrosReferencia: BairroReferencia[];
  profissoes: ProfissaoPrestador[];
  telefones: TelefonePrestador[];
  municipioPrestador: MunicipioPrestador[];
  senha?: string;
  token?: string;
  codigoPerfil?: number;
  municipios?: Municipio;
};

declare type VendaMaterial = {
  id: number;
  enderecoCliente: EnderecoCliente;
  lojista: Lojista;
  prestador: Prestador;
  dataVenda: string;
  desconto: number;
  valor: number;
};

declare type DetalheVenda = {
  id: number;
  vendaMaterial: VendaMaterial;
  produto: Produto;
  valor: number;
  quantidade: number;
  descricao: string;
  quantidadeApresentacao: number;
  detalhe: string;
  manualInstrucoes: string;
  videoDemonstrativo: string;
  cnp: string;
  descricaoDepartamento: string;
  descricaoCategoria: string;
  siglaUnidadeMedida: string;
  descricaoModelo: string;
  descricaoMarca: string;
  descricaoCor: string;
};

declare type EntregaMaterial = {
  id: number;
  vendaMaterial: VendaMaterial;
  dataEntrega: string;
  numeroNf: number;
  dataNf: string;
  arquivoNf: string;
};

declare type DetalheEntrega = {
  id: number;
  entregaMaterial: EntregaMaterial;
  detalheVenda: DetalheVenda;
}

declare type ItemEstoque = {
  id: number;
  recebimentoMaterial: RecebimentoMaterial;
  cor: Cor;
  detalheVenda: DetalheVenda;
  detalheEntrega: DetalheEntrega;
  produto: Produto;
  lojista: Lojista;
  lote: string;
  numeroSerie: string;
};

declare type SolicitacaoPreco = {
  id: number;
  fornecedor: Fornecedor;
  pedido: Pedido;
  dataSolicitacao: string;
  emailContato: string;
};
