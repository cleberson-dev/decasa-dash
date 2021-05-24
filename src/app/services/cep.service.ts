import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

type CepServiceResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(
    private http: HttpClient
  ) { }

  get(cep: string) {
    return this.http.get<CepServiceResponse>(`https://viacep.com.br/ws/${cep}/json`)
  }
}
