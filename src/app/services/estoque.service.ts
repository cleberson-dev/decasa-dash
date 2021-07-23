import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';

export type RegistrarRecebimentoMaterialParams = {
  compraMaterial: { 
    id: number; 
  };
  itensEstoque: {
    produto: { id: number; };
    numeroSerie: string | null; 
    lote: string | null; 
  }[];
  numeroNf: string | null;
  dataNf: string | null;
  arquivoNf: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  constructor(
    private http: HttpClient,
  ) { }

  registrarRecebimentoMaterial(params: RegistrarRecebimentoMaterialParams) {
    const url = `${env.API_URL}/recebimentosMateriais`;

    return this.http.post(url, params);
  }
}
