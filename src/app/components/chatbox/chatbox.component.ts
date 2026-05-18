import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../products/services/product.service';

interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  abierto = false;
  mensajes: Mensaje[] = [];
  inputTexto = '';
  cargando = false;
  productos: any[] = [];

  constructor(private productService: ProductService, private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (data: any) => { this.productos = data; },
      error: () => {}
    });

    this.agregarMensaje('assistant', '¡Hola! 👋 Soy el asistente de NeoMarket. Puedo ayudarte a encontrar productos, consultar precios y stock. ¿En qué te puedo ayudar?');
  }

  agregarMensaje(role: 'user' | 'assistant', content: string) {
    this.mensajes.push({ role, content, timestamp: new Date() });
    setTimeout(() => this.scrollAbajo(), 50);
  }

  toggleChat() {
    this.abierto = !this.abierto;
    if (this.abierto) setTimeout(() => this.scrollAbajo(), 100);
  }

  scrollAbajo() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  enviar() {
    const texto = this.inputTexto.trim();
    if (!texto || this.cargando) return;

    this.agregarMensaje('user', texto);
    this.inputTexto = '';
    this.cargando = true;

    this.ngZone.run(() => {
      setTimeout(() => {
        const respuesta = this.generarRespuesta(texto);
        this.cargando = false;
        this.agregarMensaje('assistant', respuesta);
        this.cdr.detectChanges();
      }, 600);
    });
  }

  generarRespuesta(texto: string): string {
    const t = texto.toLowerCase();

    if (/^(hola|hey|buenas|buenos|hi|hello|qué tal|que tal)/.test(t)) {
      return '¡Hola! 😊 ¿En qué puedo ayudarte hoy?';
    }

    if (/(adios|adiós|hasta luego|bye|gracias|ok|perfecto|genial)/.test(t)) {
      return '¡Hasta pronto! 👋 Si necesitas algo más, aquí estaré.';
    }

    const productoEncontrado = this.productos.find(p =>
      p.Nombre && t.includes(p.Nombre.toLowerCase())
    );

    if (productoEncontrado) {
      const p = productoEncontrado;
      const precioFinal = p.Descuento > 0
        ? (p.Precio - p.Precio * p.Descuento / 100).toFixed(2)
        : p.Precio.toFixed(2);

      let resp = `📦 ${p.Nombre}\n${p.Descripcion}\n\n`;
      if (p.Descuento > 0) {
        resp += `💰 Precio: ${p.Precio.toFixed(2)} € → ${precioFinal} € (–${p.Descuento}%)\n`;
      } else {
        resp += `💰 Precio: ${precioFinal} €\n`;
      }
      resp += p.Stock > 0 ? `✅ En stock (${p.Stock} uds)` : `❌ Sin stock`;
      return resp;
    }

    if (/(precio|cuanto|cuánto|cuesta|vale|coste)/.test(t)) {
      if (!this.productos.length) return 'No puedo consultar precios ahora mismo.';
      const min = [...this.productos].sort((a, b) => a.Precio - b.Precio)[0];
      const max = [...this.productos].sort((a, b) => b.Precio - a.Precio)[0];
      return `Nuestros precios van desde ${min.Precio.toFixed(2)} € (${min.Nombre}) hasta ${max.Precio.toFixed(2)} € (${max.Nombre}). ¿Buscas algo concreto?`;
    }

    if (/(stock|disponible|hay|tienes|tenéis|quedan)/.test(t)) {
      const con = this.productos.filter(p => p.Stock > 0).length;
      const sin = this.productos.filter(p => p.Stock === 0).length;
      return `Tenemos ${con} producto${con !== 1 ? 's' : ''} disponible${con !== 1 ? 's' : ''}. ${sin > 0 ? `(${sin} sin stock)` : '¡Todo disponible! 🎉'}`;
    }

    if (/(categoria|categoría|tipo|sección)/.test(t)) {
      const cats = [...new Set(this.productos.map(p => p.Categoria).filter(Boolean))];
      return `Tenemos: ${cats.join(', ')}. ¿Te interesa alguna?`;
    }

    const cat = this.productos.find(p => p.Categoria && t.includes(p.Categoria.toLowerCase()));
    if (cat) {
      const en = this.productos.filter(p => p.Categoria === cat.Categoria);
      return `En ${cat.Categoria}: ${en.map(p => p.Nombre).join(', ')}. ¿Te interesa alguno?`;
    }

    if (/(oferta|descuento|rebajas|promocion)/.test(t)) {
      const ofertas = this.productos.filter(p => p.Descuento > 0);
      if (!ofertas.length) return 'No hay ofertas activas ahora mismo. ¡Vuelve pronto! 😊';
      return `🏷️ En oferta: ${ofertas.map(p => `${p.Nombre} (–${p.Descuento}%)`).join(', ')}`;
    }

    if (/(productos|catálogo|catalogo|qué tenéis|que teneis|qué hay|ver todo)/.test(t)) {
      if (!this.productos.length) return 'No hay productos disponibles ahora mismo.';
      const lista = this.productos.slice(0, 5).map(p => `• ${p.Nombre} — ${p.Precio.toFixed(2)} €`).join('\n');
      const resto = this.productos.length > 5 ? `\n...y ${this.productos.length - 5} más.` : '';
      return `Algunos productos:\n${lista}${resto}`;
    }

    if (/(envio|envío|entrega|shipping)/.test(t)) {
      return '🚚 Enviamos a toda España en 2-4 días laborables. Envío gratis en pedidos +50 €.';
    }

    if (/(devolucion|devolución|devolver|cambio|reembolso)/.test(t)) {
      return '↩️ Aceptamos devoluciones en 30 días. El producto debe estar en perfectas condiciones.';
    }

    if (/(contacto|email|correo|teléfono|telefono)/.test(t)) {
      return '📧 Escríbenos a soporte@neomarket.es. Te respondemos en menos de 24h.';
    }

    return '¿Puedo ayudarte con algo más? Prueba preguntando por un producto, precio, stock u ofertas 😊';
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviar();
    }
  }
}