import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Fornecedor } from '../types';

type Options = {
  page?: number;
  itemsPerPage?: number;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'http://homologacao.appdecasa.com.br:8080/produtos-0.0.1';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get(this.url + '/produtos');
  }

  getCategories() {
    return this.http.get(this.url + '/categorias?size=100');
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
    const url = this.url + '/fornecedores';

    return this.http.put(url, fornecedor);
  }
}
