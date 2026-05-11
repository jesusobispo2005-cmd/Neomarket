import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {

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
}