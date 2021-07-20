import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, merge, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { AuthService } from './auth.service';



@Injectable({
  providedIn: 'root'
})
export class LojistasService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  get atual() {
    const url = `${env.API_URL}/lojistas/${this.authService.lojista.id}`;

    return this.http.get<Lojista>(url);
  }

  get filiais() {
    const url = `${env.API_URL}/lojistas/matriz/${this.authService.lojista.id}`;
    return this.http.get<PaginatedResource<Lojista>>(url);
  }

  porID(lojistaID: number) {
    const url = `${env.API_URL}/lojistas/${lojistaID}`;

    return this.http.get<Lojista>(url);
  }

  criarFilial(filial: RegistrarLojistaParams) {
    const url = `${env.API_URL}/lojistas/`;
    const body: RegistrarLojistaParams & { lojista: { id: number; } } = {
      ...filial,
      lojista: { id: this.authService.lojista.id },
    };

    return this.http.post<Lojista>(url, body);
  }
  
  get enderecos(): Observable<{ lojaID: number; descricao: string }[]> {
    return this.porID(this.authService.matrizId)
      .pipe(
        map(matriz => ({ lojaID: matriz.id, descricao: `${matriz.logradouro} (Matriz)` })),
        concatMap((enderecoMatriz): Observable<{ lojaID: number; descricao: string }[]> => this.filiais.pipe(map(data => [
          enderecoMatriz,
          ...data.content.map(filial => ({ lojaID: filial.id, descricao: filial.logradouro }))
        ])))
      );
  }
}
