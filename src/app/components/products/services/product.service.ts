import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private api = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.api);
  }

  getById(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }

  getByName(nombre: string) {
    return this.http.get(`${this.api}?nombre=${nombre}`);
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  update(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }
}