import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'http://homologacao.appdecasa.com.br:8080/produtos-0.0.1';

  constructor(
    private http: HttpClient
  ) { }

  getMostSoldProducts() {
    return this.http.get(this.url + '/produtos/MaisVendido');
  }
}
