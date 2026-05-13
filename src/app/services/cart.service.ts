import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: any;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  addToCart(product: any, cantidad: number) {
    const existing = this.items.find(i => i.product._id === product._id);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      this.items.push({ product, cantidad });
    }
    this.cartSubject.next([...this.items]);
  }

  removeFromCart(productId: string) {
    this.items = this.items.filter(i => i.product._id !== productId);
    this.cartSubject.next([...this.items]);
  }

  getTotal() {
    return this.items.reduce((acc, i) => {
    const precio = i.product.Descuento
      ? i.product.Precio * (1 - i.product.Descuento / 100)
      : i.product.Precio;
    return acc + precio * i.cantidad;
  }, 0);
  }

  getCount() {
    return this.items.reduce((acc, i) => acc + i.cantidad, 0);
  }

  clear() {
    this.items = [];
    this.cartSubject.next([]);
  }
}