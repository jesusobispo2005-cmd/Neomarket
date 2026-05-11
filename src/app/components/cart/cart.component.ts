import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductService } from '../products/services/product.service';

type MetodoPago = 'cartera' | 'visa' | null;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items: CartItem[] = [];
  pagando = false;

  // Método de pago
  metodoPago: MetodoPago = null;

  // Visa
  visaNumero = '';
  visaCaducidad = '';
  visaCvv = '';
  visaNombre = '';

  // Cartera digital
  carteraEmail = '';
  carteraPin = '';

  // Código descuento
  codigoDescuento = '';
  descuentoAplicado = false;
  descuentoPorcentaje = 0;
  codigoError = '';

  // Códigos válidos (en producción vendrían del backend)
  private codigosValidos: { [key: string]: number } = {
    'NEO10': 10,
    'NEO20': 20,
    'BIENVENIDO': 15,
  };

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

  getSubtotal() {
    return this.cartService.getTotal();
  }

  getDescuentoImporte() {
    if (!this.descuentoAplicado) return 0;
    return this.getSubtotal() * (this.descuentoPorcentaje / 100);
  }

  getTotal() {
    return this.getSubtotal() - this.getDescuentoImporte();
  }

  seleccionarMetodo(metodo: MetodoPago) {
    this.metodoPago = this.metodoPago === metodo ? null : metodo;
  }

  aplicarCodigo() {
    const codigo = this.codigoDescuento.trim().toUpperCase();
    if (this.codigosValidos[codigo]) {
      this.descuentoPorcentaje = this.codigosValidos[codigo];
      this.descuentoAplicado = true;
      this.codigoError = '';
    } else {
      this.descuentoAplicado = false;
      this.descuentoPorcentaje = 0;
      this.codigoError = 'Código no válido';
    }
  }

  quitarDescuento() {
    this.descuentoAplicado = false;
    this.descuentoPorcentaje = 0;
    this.codigoDescuento = '';
    this.codigoError = '';
  }

  formularioValido(): boolean {
    if (!this.metodoPago) return false;
    if (this.metodoPago === 'visa') {
      return !!(this.visaNumero && this.visaCaducidad && this.visaCvv && this.visaNombre);
    }
    if (this.metodoPago === 'cartera') {
      return !!(this.carteraEmail && this.carteraPin);
    }
    return false;
  }

  async pagar() {
    if (!this.formularioValido()) return;
    this.pagando = true;

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