import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProductListComponent } from './components/products/pages/product-list/product-list.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },   
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];