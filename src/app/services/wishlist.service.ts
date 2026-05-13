import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private api = 'http://localhost:3000/api/users';
  private wishlistSubject = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Carga la wishlist desde la BD y actualiza el estado interno
  cargar(email: string): void {
    this.http.get<any>(`${this.api}/${email}`).subscribe({
      next: (res) => this.wishlistSubject.next(res.Wishlist || []),
      error: () => {}
    });
  }

  // Devuelve si un producto está en la wishlist
  estaEnWishlist(productId: string): boolean {
    return this.wishlistSubject.value.some((p: any) => p._id === productId);
  }

  // Devuelve el número actual
  getCount(): number {
    return this.wishlistSubject.value.length;
  }

  // Añade o quita un producto y guarda en la BD
  toggle(email: string, producto: any): void {
    const actual = [...this.wishlistSubject.value];
    const index = actual.findIndex((p: any) => p._id === producto._id);

    if (index >= 0) {
      actual.splice(index, 1);
    } else {
      actual.push(producto);
    }

    // Actualiza el estado local inmediatamente
    this.wishlistSubject.next(actual);

    // Persiste en la BD
    this.http.put(`${this.api}/${email}/wishlist`, { Wishlist: actual }).subscribe({
      error: () => {
        // Si falla, recarga desde la BD para revertir
        this.cargar(email);
      }
    });
  }

  // Quita un producto y guarda en la BD
  quitar(email: string, productId: string): void {
    const actual = this.wishlistSubject.value.filter((p: any) => p._id !== productId);
    this.wishlistSubject.next(actual);

    this.http.put(`${this.api}/${email}/wishlist`, { Wishlist: actual }).subscribe({
      error: () => this.cargar(email)
    });
  }

  // Limpia el estado al cerrar sesión
  limpiar(): void {
    this.wishlistSubject.next([]);
  }
}