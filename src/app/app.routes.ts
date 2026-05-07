import { Routes } from '@angular/router';
import { ProductListComponent } from './components/products/pages/product-list/product-list.component';
import { ProductDetailComponent } from './components/products/pages/product-detail/product-detail.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'carrito', component: CartComponent }
];