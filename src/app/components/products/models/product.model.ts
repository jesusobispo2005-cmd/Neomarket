export interface Product {
  _id?: string;
  Nombre: string;
  Descripcion: string;
  Precio: number;
  Stock: number;
  Categoria: string;
  Imagenes: string[];
  Etiquetas: string[];
  Descuento?: number;
}