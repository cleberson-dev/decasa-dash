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

type CriarColaboradorParams = {
  nome: string;
  perfil: number;
  cpf: string;
  senha: string;
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

  getItensEstoquePorCompra(compraId: number) {
    const url = this.url + '/itensEstoque/compraMaterial/' + compraId;

    return this.http.get<PaginatedResource<ItemEstoque>>(url);
  }

  getVendasMaterialPorLojista(lojistaId: number) {
    const url = this.url + '/lojista/' + lojistaId;

    return this.http.get<PaginatedResource<VendaMaterial>>(url);
  }
}
