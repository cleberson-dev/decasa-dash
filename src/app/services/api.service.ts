import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
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

type CriarColaboradorParams = {
  nome: string;
  perfil: number;
  cpf: string;
  senha: string;
};

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

type CriarCompraParams = 
  Pick<CompraMaterial, "valor">
  & { 
    lojista: Pick<Lojista, "id">; 
    fornecedor: Pick<Fornecedor, "id">;
    detalhesCompras: (Pick<DetalheCompra, "quantidade" | "valor"> & { produto: Pick<Produto, "id"> })[] 
  };


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = '/produtos-0.0.1';

  constructor(private http: HttpClient) {}

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

  getProdutosLojistaMaisVendidos(lojistaId: number, paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;
    
    let url = this.url + '/produtos/maisVendido/?idLojista=' + lojistaId;
    url += '&page=' + page;
    url += '&size=' + size;

    return this.http.get<PaginatedResource<ProdutoLojista>>(url);
  };

  getUnidadesDeMedidas() {
    const url = this.url + '/unidadesMedidas';

    return this.http.get<UnidadeMedida[]>(url);
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

  getCompras(lojistaId: number, emAberto: boolean = true) {
    const url = this.url + `/comprasMateriais/lojista/${lojistaId}?emAberto=${emAberto}`;

    return this.http.get<PaginatedResource<CompraMaterial>>(url);
  }

  getDetalhesCompra(compraId: number) {
    const url = this.url + `/detalhesCompras/compraMaterial/${compraId}`;
    
    return this.http.get<PaginatedResource<DetalheCompra>>(url);
  }

  gerarCompras(compras: CriarCompraParams[]) {
    const url = this.url + '/comprasMateriais';

    return this.http.post(url, compras);
  }

  getCotacoesPorPedido(pedidoId: number) {
    const url = this.url + '/cotacoes/pedido/' + pedidoId;
    return this.http.get<Cotacao[]>(url);
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

  atualizarCotacoes(pedidoId: number, cotacoes: { 
    detalhePedido: { id: number; }; 
    fornecedor: { id: number; }
    preco: number;
  }[]) {
    const url = this.url + '/cotacoes/' + pedidoId;

    return this.http.patch<PaginatedResource<Cotacao>>(url, cotacoes);
  }
}
