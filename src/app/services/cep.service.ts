import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(
    private http: HttpClient
  ) { }

  get(cep: string) {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json`)
  }
}
