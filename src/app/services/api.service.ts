import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url = 'http://localhost:8081';

  constructor(
    private http: HttpClient
  ) { }

  getMostSoldProducts() {
    return this.http.get(this.url + '/produtos');
  }
}
