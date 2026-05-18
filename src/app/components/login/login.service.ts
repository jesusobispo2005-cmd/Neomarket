import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private api = 'http://localhost:3000/api/users';
  private tokenKey = 'Token';
  private emailKey = 'Email';
  private adminKey = 'Admin';

  constructor(private http: HttpClient) {}

  getByEmail(Email: string) {
    return this.http.get(`${this.api}/Email=${Email}`);
  }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.api}/login`, data);
  }

  update(Email: string, data: any) {
    return this.http.put(`${this.api}/${Email}`, data);
  }

  delete(Email: string) {
    return this.http.delete(`${this.api}/${Email}`);
  }


  // Auth methods
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.adminKey) === 'true';
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.adminKey);
  }
}
