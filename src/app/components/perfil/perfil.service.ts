import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private api = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getByEmail(Email: string) {
    return this.http.get(`${this.api}/${Email}`);
  }
}
