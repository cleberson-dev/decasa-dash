import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static storageKey = 'lojista';

  constructor() { }

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

  get isLogado(): boolean {
    return !!localStorage.getItem(AuthService.storageKey);
  }
}
