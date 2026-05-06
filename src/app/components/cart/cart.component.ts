import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductService } from '../products/services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items: CartItem[] = [];
  pagando = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
    });
  }

  remove(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  getTotal() {
    return this.cartService.getTotal();
  }

  async pagar() {
    this.pagando = true;

    // Verificar que hay stock suficiente antes de proceder
    for (const item of this.items) {
      if (item.cantidad > item.product.Stock) {
        alert(`No hay suficiente stock para "${item.product.Nombre}". Disponible: ${item.product.Stock}`);
        this.pagando = false;
        return;
      }
    }

    try {
      for (const item of this.items) {
        const nuevoStock = item.product.Stock - item.cantidad;
        await this.productService.updateStock(item.product._id, nuevoStock).toPromise();
      }

      this.cartService.clear();
      alert('¡Pedido realizado con éxito!');
      this.router.navigate(['/']);

    } catch (err) {
      console.error('Error al procesar el pago:', err);
      alert('Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      this.pagando = false;
    }
  }
}