import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FieldsOptionsService {

  constructor(
    private http: HttpClient
  ) { }

  getSexos() {
    return this.http.get('http://localhost:8081/sexos')
  }
}
