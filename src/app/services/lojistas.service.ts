import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LojistasService {
  constructor(private http: HttpClient, private authService: AuthService) {}

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
    const body: RegistrarLojistaParams & { lojista: { id: number } } = {
      ...filial,
      lojista: { id: this.authService.lojista.id },
    };

    return this.http.post<Lojista>(url, body);
  }

  get todas() {
    return this.porID(this.authService.matrizId).pipe(
      concatMap((matriz) =>
        this.filiais.pipe(
          map(data => [matriz, ...data.content])
        )
      )
    );
  }

  get enderecos(): Observable<EnderecoLojista[]> {
    return this.todas.pipe(
      map((lojas) => lojas.map(loja => ({
        lojaID: loja.id,
        descricao: loja.logradouro,
      })))
    );
  }
}
