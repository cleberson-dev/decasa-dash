import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Department } from '../pages/produtos/produtos.component';

type AddProdutosItem = {
  produtoId: number;
  lojistaId: number; 
  preco: number; 
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
  email: string;
  senha: string;
  telefone: string;
  celular: string;

  razaoSocial: string;
  inscricaoEstadual: string;
  cnpj: string;
  rg: string;
  logradouro: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = '/produtos-0.0.1';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<PaginatedResource<Produto[]>>(this.url + '/produtos/paginacao');
  }

  getProdutosLojista(idDoLojista?: number) {
    return this.http.get<ProdutoLojista[]>(this.url + '/produtos/lojista/' + idDoLojista);
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

  getProductsByCategory(id: number, options?: Options) {
    let url = this.url + '/produtos/categoria/' + id;
    url += '?page=' + ((options?.page || 1) - 1);
    url += '&size=' + (options?.itemsPerPage || 10);

    return this.http.get<PaginatedResource<any>>(url);
  }

  getFornecedores(): Observable<Fornecedor[]> {
    const url = this.url + '/fornecedores';

    return this.http.get<Fornecedor[]>(url);
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
      usuario: { id: 1823 },
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
    return this.http.get<ApiMunicipio[]>(url, { headers });
  }


  getUfs() {
    const url = '/cadastros-0.0.1/util/uf';

    return this.http.get<ApiUF[]>(url);
  }


  getProdutosMaisVendidos() {
    const url = this.url + '/produtos/maisVendido';

    return this.http.get<Produto[]>(url);
  }

  findProdutoByCnp(cnp: string) {
    const lojista = 1; // HARDCODED, REPLACE IT LATER
    const url = `${this.url}/produtos/cnp/${cnp}/lojista/${lojista}`;

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

  addProdutos(items: AddProdutosItem[]) {
    const url = this.url + '/lojistasProdutos';

    const body = items.map(item => ({
      lojista: { id: item.lojistaId },
      produto: { id: item.produtoId },
      valor: item.preco,
      estoqueMinimo: item.estoqueMinimo
    }));

    return this.http.post(url, body);
  }

  getComprasPorLojista(lojistaId: number = 2) {
    const url = this.url + `/comprasMateriais/lojista/${lojistaId}`;

    return this.http.get<PaginatedResource<CompraMaterial>>(url);
  }

  getCompra(compraId: number) {
    const url = this.url + `/comprasMateriais/${compraId}`;
    
    return this.http.get<CompraMaterial>(url);
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
    const usuarioUrl = '/cadastros-0.0.1/cliente';
    const lojistaUrl = this.url + '/lojistas/';

    const usuarioBody = {
      email: params.email,
      senha: params.senha,
      telefone: params.telefone,
      celular: params.celular
    };

    this.http.post(usuarioUrl, usuarioBody)
      .pipe(
        mergeMap(_ => {
          const lojistaBody = {
            razaoSocial: params.razaoSocial,
            cnpj: params.cnpj,
            rg: params.rg,
            inscricaoEstadual: params.inscricaoEstadual,
            logradouro: params.logradouro
          };

          return this.http.post(lojistaUrl, lojistaBody);
        })
      );
  }
}
