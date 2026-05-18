import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../products/services/product.service';

type Vista = 'lista' | 'crear' | 'editar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  vista: Vista = 'lista';
  productos: any[] = [];
  cargando = false;
  guardando = false;
  confirmandoId: string | null = null;

  // Formulario compartido crear/editar
  form: any = this.formVacio();
  imagenesSeleccionadas: File[] = [];
  previewUrls: string[] = [];
  productoEditandoId: string | null = null;

  categorias = ['Electronica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Otros'];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  formVacio() {
    return {
      Nombre: '',
      Descripcion: '',
      Precio: null,
      Stock: null,
      Categoria: '',
      Descuento: 0,
      Etiquetas: ''
    };
  }

  cargarProductos() {
    this.cargando = true;
    this.productService.getAll().subscribe({
      next: (data: any) => {
        this.productos = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  // ── NAVEGACIÓN ──────────────────────────────────────────

  irACrear() {
    this.form = this.formVacio();
    this.imagenesSeleccionadas = [];
    this.previewUrls = [];
    this.productoEditandoId = null;
    this.vista = 'crear';
  }

  irAEditar(producto: any) {
    this.productoEditandoId = producto._id;
    this.form = {
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      Precio: producto.Precio,
      Stock: producto.Stock,
      Categoria: producto.Categoria,
      Descuento: producto.Descuento || 0,
      Etiquetas: producto.Etiquetas?.join(', ') || ''
    };
    this.imagenesSeleccionadas = [];
    this.previewUrls = producto.Imagenes?.map(
      (img: string) => `http://localhost:3000/uploads/img/${img}`
    ) || [];
    this.vista = 'editar';
  }

  irALista() {
    this.vista = 'lista';
    this.confirmandoId = null;
  }

  // ── IMÁGENES ─────────────────────────────────────────────

  onImagenesChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.imagenesSeleccionadas = Array.from(input.files);
    this.previewUrls = [];

    for (const file of this.imagenesSeleccionadas) {
      const reader = new FileReader();
      reader.onload = (e) => this.previewUrls.push(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  // ── CREAR ────────────────────────────────────────────────

  crear() {
    if (!this.formularioValido()) return;
    this.guardando = true;

    const fd = new FormData();
    fd.append('Nombre', this.form.Nombre);
    fd.append('Descripcion', this.form.Descripcion);
    fd.append('Precio', String(this.form.Precio));
    fd.append('Stock', String(this.form.Stock));
    fd.append('Categoria', this.form.Categoria);
    fd.append('Descuento', String(this.form.Descuento || 0));
    fd.append('Etiquetas', this.form.Etiquetas);
    for (const img of this.imagenesSeleccionadas) {
      fd.append('imagenes', img);
    }

    this.productService.create(fd).subscribe({
      next: () => {
        this.guardando = false;
        this.cargarProductos();
        this.irALista();
      },
      error: () => { this.guardando = false; }
    });
  }

  // ── EDITAR ───────────────────────────────────────────────

  guardarEdicion() {
    if (!this.formularioValido() || !this.productoEditandoId) return;
    this.guardando = true;

    const fd = new FormData();
    fd.append('Nombre', this.form.Nombre);
    fd.append('Descripcion', this.form.Descripcion);
    fd.append('Precio', String(this.form.Precio));
    fd.append('Stock', String(this.form.Stock));
    fd.append('Categoria', this.form.Categoria);
    fd.append('Descuento', String(this.form.Descuento || 0));
    fd.append('Etiquetas', this.form.Etiquetas);
    for (const img of this.imagenesSeleccionadas) {
      fd.append('imagenes', img);
    }

    this.productService.update(this.productoEditandoId, fd).subscribe({
      next: () => {
        this.guardando = false;
        this.cargarProductos();
        this.irALista();
      },
      error: () => { this.guardando = false; }
    });
  }

  // ── ELIMINAR ─────────────────────────────────────────────

  pedirConfirmacion(id: string) {
    this.confirmandoId = id;
  }

  cancelarConfirmacion() {
    this.confirmandoId = null;
  }

  eliminar(id: string) {
    this.productService.delete(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p._id !== id);
        this.confirmandoId = null;
      }
    });
  }

  // ── VALIDACIÓN ───────────────────────────────────────────

  formularioValido(): boolean {
    return !!(
      this.form.Nombre?.trim() &&
      this.form.Descripcion?.trim() &&
      this.form.Precio !== null && this.form.Precio >= 0 &&
      this.form.Stock !== null && this.form.Stock >= 0 &&
      this.form.Categoria
    );
  }

  getPrecioConDescuento(precio: number, descuento: number): number {
    return precio - precio * (descuento / 100);
  }
}