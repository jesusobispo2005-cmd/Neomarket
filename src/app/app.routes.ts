import { Routes } from '@angular/router';
import { ProductListComponent } from './components/products/pages/product-list/product-list.component';
import { ProductDetailComponent } from './components/products/pages/product-detail/product-detail.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent }
];