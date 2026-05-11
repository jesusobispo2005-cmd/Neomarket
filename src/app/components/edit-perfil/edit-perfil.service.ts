import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EditPerfilService {
  private api = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getByEmail(Email: string) {
    return this.http.get(`${this.api}/${Email}`);
  }

  update(Email: string, data: any) {
    return this.http.put(`${this.api}/${Email}`, data);
  }
}
