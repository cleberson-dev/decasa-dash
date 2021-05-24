import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Fornecedor, Produto } from '../types';
import { Department } from '../pages/produtos/produtos.component';

type Options = {
  page?: number;
  itemsPerPage?: number;
};

export type ApiMunicipioEndereco = {
  id: number;
  nome: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'http://homologacao.appdecasa.com.br:8080/produtos-0.0.1';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Produto[]> {
    return this.http.get(this.url + '/produtos').pipe(
      map((data: any) =>
        data.map(
          (produto): Produto => ({
            id: produto.id,
            nome: produto.descricao,
            marca: {
              id: produto.modelo.marca.id,
              nome: produto.modelo.marca.descricao,
            },
            modelo: {
              id: produto.modelo.id,
              nome: produto.modelo.descricao,
            },
            categoria: {
              id: produto.categoria.id,
              nome: produto.categoria.descricao,
            },
            departamento: {
              id: produto.categoria.departamento.id,
              nome: produto.categoria.departamento.descricao,
            },
            foto: produto.foto,
            cnp: produto.cnp,
            detalhe: produto.detalhe,
            manualInstrucao: produto.manualInstrucao,
            videoDemonstrativo: produto.videoDemonstrativo,
            quantidadeApresentacao: produto.quantidadeApresentacao,
          })
        )
      )
    );
  }

  getProdutosLojista() {
    return this.http.get(this.url + '/lojistasProdutos');
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

  getProductsByCategory(id: string, options?: Options) {
    let url = this.url + '/produtos/categoria/' + id;
    url += '?page=' + ((options?.page || 1) - 1);
    url += '&size=' + (options?.itemsPerPage || 10);

    return this.http.get(url);
  }

  getFornecedores(): Observable<Fornecedor[]> {
    const url = this.url + '/fornecedores';

    return this.http.get(url).pipe(
      map((data: any) =>
        data.map(
          (f: any): Fornecedor => ({
            id: f.id,
            nome: f.nome,
            cnpj: f.cnpj,
            logradouro: f.logradouro,
            bairro: f.bairro,
            numero: f.numero,
            cep: f.cep,
            celular: f.celular,
            telefone: f.telefone,
            email: f.email,
            pontoReferencia: f.pontoReferencia,
            municipioEndereco: {
              id: f.municipioEndereco.id,
              nome: f.municipioEndereco.nome,
              ativo: f.municipioEndereco.ativo,
            },
            orgaoExpedidor: {
              id: f.orgaoExpedidor.id,
              descricao: f.orgaoExpedidor.descricao,
            },
            estadoCivil: {
              id: f.estadoCivil.id,
              descricao: f.estadoCivil.descricao,
            },
          })
        )
      )
    );
  }

  editFornecedor(fornecedor: Fornecedor) {
    const url = this.url + '/fornecedores/' + fornecedor.id;

    return this.http.put(url, fornecedor);
  }

  criarFornecedor(novoFornecedor: Fornecedor) {
    const url = this.url + '/fornecedores/';

    const body = {
      nome: novoFornecedor.nome,
      cnpj: novoFornecedor.cnpj,
      logradouro: novoFornecedor.logradouro,
      bairro: novoFornecedor.bairro,
      numero: novoFornecedor.numero,
      cep: novoFornecedor.cep,
      celular: novoFornecedor.celular,
      telefone: novoFornecedor.telefone,
      email: novoFornecedor.email,
      pontoReferencia: novoFornecedor.pontoReferencia,
      municipioEndereco: { id: 2 },
      orgaoExpedidor: { id: 2 },
      estadoCivil: { id: 3 },
    };

    return this.http.post(url, body);
  }

  removerFornecedor(id: number) {
    const url = this.url + '/fornecedores/' + id;

    return this.http.delete(url);
  }

  getMunicipioEnderecos(): Observable<ApiMunicipioEndereco[]> {
    const url = 'https://homologacao.appdecasa.com.br/v1/rest/decasa/clientAddress/113';
    const headers = {
      'Access-Token': 'G416F208V208U416V1196D780E416U1196Y884W416H1144H1196H364H676X780K936G416G936V832O416G416C416V1144H1196H'
    };
    return this.http.get<any>(url, { headers })
      .pipe(
        map(data => data.map(endereco => ({
          id: endereco.municipio.id,
          nome: endereco.municipio.nome,
          ativo: endereco.municipio.ativo
        })))
      );
  }
}
