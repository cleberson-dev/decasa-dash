import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

type CepInformacao = {
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
export class LocalizacaoService {

  baseUrl = '/cadastros-0.0.1/util';

  constructor(
    private http: HttpClient,
  ) { }

  get ufs() {
    const url = `${this.baseUrl}/uf`;

    return this.http.get<ApiUF[]>(url);
  }

  municipiosPorUf(ufID: number) {
    const url = `${this.baseUrl}/util/municipios/${ufID}`;
    const headers = {
      'Access-Token': 'G416F208V208U416V1196D780E416U1196Y884W416H1144H1196H364H676X780K936G416G936V832O416G416C416V1144H1196H',
    };

    return this.http.get<ApiMunicipio[]>(url, { headers })
      .pipe(
        map(municipios => municipios.filter(mun => mun.ativo))
      );
  }

  informacaoCep(cep: string) {
    return this.http.get<CepInformacao>(`https://viacep.com.br/ws/${cep}/json`)
  }
}
