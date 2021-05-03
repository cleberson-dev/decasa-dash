import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Options = {
  page?: number;
  itemsPerPage?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = 'http://localhost:8081';

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts() {
    return this.http.get(this.url + '/produtos');
  }

  getCategories() {
    return this.http.get(this.url + '/categorias?size=100');
  }

  getProductsByCategory(id: string, options?: Options) {
    let url = this.url + '/produtos/categoria/' + id;
    url += '?page=' + ((options?.page || 1) - 1);
    url += '&size=' + (options?.itemsPerPage || 10);
  
    return this.http.get(url);
  }
}
