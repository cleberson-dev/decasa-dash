import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Department } from '../pages/produtos/solicitar/solicitar.component';

type AddProductItem = {
  produto: Produto;
  valor: number;
  estoqueMinimo: number;
};

type Options = {
  page?: number;
  itemsPerPage?: number;
};

export type ApiMunicipio = {
  id: number;
  nome: string;
  ativo: boolean;
};

export type ApiUF = {
  id: number
  nome: string;
  sigla: string;
}

export type RegistrarLojistaParams = {
  razaoSocial: string;
  nome: string;
  cnpj: string;
  inscricaoEstadual: string;
  cpf: string;
  email: string;
  senha: string;
  cep: string;
  logradouro: string;
  bairro: string;
  ufRg: { id: number; };
  municipio: { id: number; };
  pontoReferencia: string;
  celular: string;
  telefone?: string;

  perfil: { id: number; };
  rg?: string;
}

type LogarLojistaParams = {
  email: string;
  senha: string;
}

type CriarColaboradorParams = {
  nome: string;
  perfil: number;
  cpf: string;
  senha: string;
};

type PaginationOptions = {
  page?: number;
  size?: number;
}

type CriarPedidoParams = {
  lojista: {
    id: number;
  };
  detalhesPedidos: {
    produto: { id: number; };
    quantidade: number;
  }[];
  fornecedores: {
    id: number;
  }[];
}



@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = '/produtos-0.0.1';

  constructor(private http: HttpClient) {}

  getAllProducts(lojistaId: number, paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;

    let url = this.url + '/produtos/lojista/' + lojistaId;
    url += '?page=' + page;
    url += '&size=' + size;
    url += '&naoSelecionado=true';

    return this.http.get<PaginatedResource<Produto>>(url);
  }

  getProdutosPorCategoria(categoriaId: number, lojistaId: number) {
    let url = `${this.url}/produtos/lojista/${lojistaId}/categoria/${categoriaId}`;
    url += '?naoSelecionado=true';
    
    return this.http.get<PaginatedResource<Produto>>(url);
  }

  getProdutosLojista(lojistaId: number) {
    const url = this.url + '/lojistasProdutos/lojista/' + lojistaId;
    return this.http.get<PaginatedResource<ProdutoLojista>>(url);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get(this.url + '/categorias?size=100').pipe(
      map((categorias: any): Department[] => {
        const departments = [];

        categorias.forEach((categoria) => {
          const cur = departments.find(
            (d) => d.id === categoria.departamento.id
          );
          if (cur) {
            cur.categories.push({
              id: categoria.id,
              name: categoria.descricao,
            });
          } else {
            departments.push({
              id: categoria.departamento.id,
              name: categoria.departamento.descricao,
              categories: [{ id: categoria.id, name: categoria.descricao }],
            });
          }
        });

        return departments;
      })
    );
  }

  getProdutosLojistaPorCategoria(categoriaId: number, lojistaId: number, options?: Options) {
    let url = this.url + `/lojistasProdutos/lojista/${lojistaId}/categoria/${categoriaId}`;
    url += '?page=' + ((options?.page || 1) - 1);
    url += '&size=' + (options?.itemsPerPage || 10);

    return this.http.get<PaginatedResource<ProdutoLojista>>(url);
  }

  getFornecedoresPorLojista(lojistaId: number) {
    const url = this.url + '/fornecedores/lojista/' + lojistaId;

    return this.http.get<PaginatedResource<Fornecedor>>(url);
  }

  editFornecedor(fornecedor: Fornecedor) {
    const url = this.url + '/fornecedores/' + fornecedor.id;

    return this.http.put(url, fornecedor);
  }

  criarFornecedor(novoFornecedor: Fornecedor) {
    const url = this.url + '/fornecedores/';

    const body: Fornecedor = {
      cnpj: novoFornecedor.cnpj,
      logradouro: novoFornecedor.logradouro,
      bairro: novoFornecedor.bairro,
      numero: novoFornecedor.numero,
      cep: novoFornecedor.cep,
      celular: novoFornecedor.celular,
      telefone: novoFornecedor.telefone,
      email: novoFornecedor.email,
      pontoReferencia: novoFornecedor.pontoReferencia,
      municipioEndereco: { id: novoFornecedor.municipioEndereco.id },
      inscricaoEstadual: novoFornecedor.inscricaoEstadual,
      ufRg: { id: novoFornecedor.ufRg.id },
      usuario: { id: novoFornecedor.usuario.id },
      categoriasFornecidas: novoFornecedor.categoriasFornecidas,
      departamentosFornecidos: novoFornecedor.categoriasFornecidas,
      razaoSocial: novoFornecedor.razaoSocial,
      nomeFantasia: novoFornecedor.nomeFantasia
    };

    return this.http.post(url, body);
  }

  removerFornecedor(id: number) {
    const url = this.url + '/fornecedores/' + id;

    return this.http.delete(url);
  }

  getMunicipiosByUf(ufId: number) {
    const url = '/cadastros-0.0.1/util/municipios/' + ufId;
    const headers = {
      'Access-Token': 'G416F208V208U416V1196D780E416U1196Y884W416H1144H1196H364H676X780K936G416G936V832O416G416C416V1144H1196H',
    };
    return this.http.get<ApiMunicipio[]>(url, { headers })
      .pipe(
        map(municipios => municipios.filter(mun => mun.ativo))
      );
  }


  getUfs() {
    const url = '/cadastros-0.0.1/util/uf';

    return this.http.get<ApiUF[]>(url);
  }

  getProdutosMaisVendidos(lojistaId: number, paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;
    
    let url = this.url + '/produtos/maisVendido/';
    url += '&page=' + page;
    url += '&size=' + size;
    url += '&idLojista=' + lojistaId;

    return this.http.get<PaginatedResource<Produto>>(url);
  };


  getProdutosLojistaMaisVendidos(lojistaId: number, paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;
    
    let url = this.url + '/produtos/maisVendido/?idLojista=' + lojistaId;
    url += '&page=' + page;
    url += '&size=' + size;

    return this.http.get<PaginatedResource<ProdutoLojista>>(url);
  };

  findProdutoByCnp(cnp: string, lojistaId: number) {
    const url = `${this.url}/produtos/cnp/${cnp}/lojista/${lojistaId}`;

    return this.http.get<Produto>(url);
  }

  getUnidadesDeMedidas() {
    const url = this.url + '/unidadesMedidas';

    return this.http.get<UnidadeMedida[]>(url);
  }

  criarProduto(produto: Produto) {
    const url = this.url + '/produtos';
    return this.http.post(url, produto);
  }

  addProdutos(items: AddProductItem[], lojistaId: number) {
    const url = this.url + '/lojistasProdutos';

    const body = items.map(item => ({
      lojista: { id: lojistaId },
      produto: { id: item.produto.id as number },
      valor: item.valor,
      estoqueMinimo: item.estoqueMinimo
    }));

    return this.http.post(url, body);
  }

  getComprasPorLojista(lojistaId: number) {
    const url = this.url + `/comprasMateriais/lojista/${lojistaId}`;

    return this.http.get<PaginatedResource<CompraMaterial>>(url);
  }

  getDetalhesCompra(compraId: number) {
    const url = this.url + `/detalhesCompras/compraMaterial/${compraId}`;
    
    return this.http.get<PaginatedResource<DetalheCompra>>(url);
  }

  gerarCompras(compras: CompraMaterial[]) {
    const url = this.url + '/comprasMateriais';

    return this.http.post(url, compras);
  }

  getFornecedor(fornecedorId: number) {
    const url = this.url + '/fornecedores/' + fornecedorId;
    return this.http.get<Fornecedor>(url);
  }

  getProduto(produtoId: number) {
    const url = this.url + '/produtos/' + produtoId;

    return this.http.get<Produto>(url);
  }

  getCotacoesPorPedido(pedidoId: number) {
    const url = this.url + '/cotacoes/pedido/' + pedidoId;
    return this.http.get<Cotacao[]>(url);
  }

  registrarLojista(params: RegistrarLojistaParams) {
    const url = this.url + '/lojistas/';

    return this.http.post<Lojista>(url, params);
  }

  logarLojista(params: LogarLojistaParams) {
    const { email, senha } = params;
    const url = `${this.url}/lojistas/email/${email}/senha/${senha}`;
    
    return this.http.get<Lojista>(url);
  }

  buscarProdutoLojista(query: string, lojistaId: number, paginationOpts?: PaginationOptions) {
    const page = (paginationOpts?.page || 1) - 1;
    const size = paginationOpts?.size || 10;

    let url = this.url + '/lojistasProdutos/lojista/' + lojistaId;
    url += '?palavraChave=' + query;
    url += '&page=' + page;
    url += '&size=' + size;

    return this.http.get<PaginatedResource<ProdutoLojista>>(url);
  }

  buscarProduto(query: string) {
    const url = this.url + `/produtos?palavraChave=${query}`;
    return this.http.get<PaginatedResource<Produto>>(url);
  }

  buscarProdutoPorCategoria(query: string, categoriaId: number, paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;

    let url = this.url + '/produtos/categorias/' + categoriaId;
    url += '?palavraChave=' + query;
    url += '&page=' + page;
    url += '&size=' + size;

    return this.http.get<PaginatedResource<Produto>>(url);
  }

  buscarProdutosMaisVendidosLojista(lojistaId: number) {
    const url = this.url + `/produtos/maisVendido?idLojista=${lojistaId}`;

    return this.http.get<Produto[]>(url);
  }

  criarColaborador(params: CriarColaboradorParams) {
    const url = this.url + '/colaboradores/';

    return this.http.post(url, params);
  }

  listarColaboradores(lojistaId: number) {
    const url = this.url + '/colaboradores/?lojistaId=' + lojistaId;

    return this.http.get(url);
  }

  getLojista(lojistaId: number) {
    const url = this.url + '/lojistas/' + lojistaId;

    return this.http.get<Lojista>(url);
  }

  criarPedido(params: CriarPedidoParams) {
    const url = this.url + '/pedidos';

    return this.http.post<{ id: number; dataCadastro: number; lojista: Lojista; }>(url, params);
  }

  getItensEstoquePorCompra(compraId: number) {
    const url = this.url + '/itensEstoque/compraMaterial/' + compraId;

    return this.http.get<PaginatedResource<ItemEstoque>>(url);
  }

  getVendasMaterialPorLojista(lojistaId: number) {
    const url = this.url + '/lojista/' + lojistaId;

    return this.http.get<PaginatedResource<VendaMaterial>>(url);
  }

  getCompra(compraId: number) {
    const url = this.url + '/comprasMateriais/' + compraId;

    return this.http.get<CompraMaterial>(url);
  }

  getPedido(pedidoId: number) {
    const url = this.url + '/pedidos/' + pedidoId;

    return this.http.get<Pedido>(url);
  }

  getSolicitacoesPreco(pedidoId: number) {
    const url = this.url + '/solicitacoesPrecos/pedido/' + pedidoId;
    
    return this.http.get<PaginatedResource<SolicitacaoPreco>>(url);
  }

  getPedidosPorLojista(lojistaId: number) {
    const url = this.url + '/pedidos/lojista/' + lojistaId;

    return this.http.get<PaginatedResource<{
      id: number;
      lojista: { id: number };
      dataCadastro: string;
    }>>(url);
  }

  getFiliais(lojistaId: number) {
    const url = this.url + '/lojistas/matriz/' + lojistaId;
    return this.http.get<PaginatedResource<Lojista>>(url);
  }

  criarFilial(matrizId: number, filial: RegistrarLojistaParams) {
    const url = this.url + '/lojistas/';
    const body: RegistrarLojistaParams & { lojista: { id: number; } } = {
      ...filial,
      lojista: { id: matrizId },
    };
    console.log('POST', body);

    return this.http.post<Lojista>(url, body);
  }
}
