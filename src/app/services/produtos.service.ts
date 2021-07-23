import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  obter(produtoId: number) {
    const url = env.API_URL + '/produtos/' + produtoId;

    return this.http.get<Produto>(url);
  }

  todos(paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;

    let url = env.API_URL + '/produtos/lojista/' + this.authService.lojista.id;
    url += '?page=' + page;
    url += '&size=' + size;
    url += '&naoSelecionado=true';

    return this.http.get<PaginatedResource<Produto>>(url);
  }

  porCategoria(categoriaID: number) {
    let url = `${env.API_URL}/produtos/lojista/${this.authService.lojista.id}/categoria/${categoriaID}`;
    url += '?naoSelecionado=true';
    
    return this.http.get<PaginatedResource<Produto>>(url);
  }

  maisVendidos(paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;
    
    let url = env.API_URL + '/produtos/maisVendido/';
    url += '&page=' + page;
    url += '&size=' + size;
    url += '&idLojista=' + this.authService.lojista.id;

    return this.http.get<PaginatedResource<Produto>>(url);
  }

  porCodigo(codigo: string) {
    const url = `${env.API_URL}/produtos/cnp/${codigo}/lojista/${this.authService.lojista.id}`;

    return this.http.get<Produto>(url);
  }

  criarProduto(produto: Produto) {
    const url = env.API_URL + '/produtos';
    
    return this.http.post(url, produto);
  }

  buscarPorDescricao(descricao: string) {
    const url = `${env.API_URL}/produtos?palavraChave=${descricao}`;
    
    return this.http.get<PaginatedResource<Produto>>(url);
  }

  buscarPorDescricaoECategoria(descricao: string, categoriaID: number, paginationOptions?: PaginationOptions) {
    const page = (paginationOptions?.page || 1) - 1;
    const size = paginationOptions?.size || 10;

    let url = env.API_URL + '/produtos/categorias/' + categoriaID;
    url += '?palavraChave=' + descricao;
    url += '&page=' + page;
    url += '&size=' + size;

    return this.http.get<PaginatedResource<Produto>>(url);
  }

  getProdutosEmEstoque(paginationOpts?: PaginationOptions) {
    const page = (paginationOpts?.page || 1) - 1;
    const size = paginationOpts?.size || 10;
    
    let url = `${env.API_URL}/produtos/lojista/${this.authService.lojista.id}`;
    url += '?emEstoque=true';
    url += `&page=${page}`;
    url += `&size=${size}`;

    return this.http.get<PaginatedResource<Produto>>(url);  
  }
}
