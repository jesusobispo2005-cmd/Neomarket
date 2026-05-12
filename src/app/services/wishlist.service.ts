import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private api = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private items: any[] = [];
  private wishlistSubject = new BehaviorSubject<any[]>([]);

  wishlist$ = this.wishlistSubject.asObservable();

  toggle(product: any) {
    const idx = this.items.findIndex(p => p._id === product._id);
    if (idx >= 0) {
      this.items.splice(idx, 1);
    } else {
      this.items.push(product);
    }
    this.wishlistSubject.next([...this.items]);
  }

  isInWishlist(productId: string): boolean {
    return this.items.some(p => p._id === productId);
  }

  remove(productId: string) {
    this.items = this.items.filter(p => p._id !== productId);
    this.wishlistSubject.next([...this.items]);
  }

  getCount(): number {
    return this.items.length;
  }

  getAll(): any[] {
    return [...this.items];
  }

  update(Email: string, data: any) {
    return this.http.put(`${this.api}/${Email}`, data);
  }

  getByEmail(Email: string) {
    return this.http.get(`${this.api}/${Email}`);
  }

  updateWishlist(Email: string, data: any) {
    return this.http.put(`${this.api}/${Email}/wishlist`, data);
  }

}