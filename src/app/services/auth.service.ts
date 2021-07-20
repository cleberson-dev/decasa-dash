import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static storageKey = 'lojista';

  constructor(
    private http: HttpClient,
  ) { }

  save(lojista: Lojista) {
    localStorage.setItem(AuthService.storageKey, JSON.stringify(lojista));
  }

  logout() {
    localStorage.removeItem(AuthService.storageKey);
    window.location.reload();
  }

  get lojista(): Lojista {
    return JSON.parse(localStorage.getItem(AuthService.storageKey));
  }

  get estaLogado(): boolean {
    return !!localStorage.getItem(AuthService.storageKey);
  }

  get isMatriz(): boolean {
    return this.lojista && !this.lojista.lojista;
  }

  get matrizId(): number {
    return this.isMatriz ? this.lojista.id : this.lojista.lojista.id;
  }

  registrar(params: RegistrarLojistaParams) {
    const url = `${env.API_URL}/lojistas/`;

    return this.http.post<Lojista>(url, params);
  }

  login(params: LogarLojistaParams) {
    const { email, senha } = params;
    const url = `${env.API_URL}/lojistas/email/${email}/senha/${senha}`;
    
    return this.http.get<Lojista>(url);
  }
}
