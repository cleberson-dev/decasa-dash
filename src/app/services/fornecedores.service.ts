import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FornecedoresService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  obter(fornecedorID: number) {
    const url = env.API_URL + '/fornecedores/' + fornecedorID;

    return this.http.get<Fornecedor>(url);
  }

  todos() {
    // FALTA A API PAGINAR E VINCULAR A UM LOJISTA
    // const url = `${env.API_URL}/fornecedores/lojista/${this.authService.lojista.id}`;
    // return this.http.get<PaginatedResource<Fornecedor>>(url);
    
    const url = env.API_URL + '/fornecedores';
    return this.http.get<Fornecedor[]>(url);
  }

  criar(novoFornecedor: Fornecedor) {
    const url = env.API_URL + '/fornecedores/';

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

  editar(fornecedor: Fornecedor) {
    const url = env.API_URL + '/fornecedores/' + fornecedor.id;

    return this.http.put(url, fornecedor);
  }

  remover(fornecedorID: number) {
    const url = env.API_URL + '/fornecedores/' + fornecedorID;

    return this.http.delete(url);
  }
}
