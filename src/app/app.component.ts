import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  cartCount = 0;
  wishlistCount = 0;
  isAdmin = false;
  isLoggedIn = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCount();
    });
    this.wishlistService.wishlist$.subscribe(() => {
      this.wishlistCount = this.wishlistService.getCount();
    });

    // Actualizar estado admin/login cada vez que cambia la ruta
    // (por si hace login/logout)
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoggedIn = !!localStorage.getItem('Token');
      this.isAdmin = localStorage.getItem('Admin') === 'true';
    });

    // Estado inicial
    this.isLoggedIn = !!localStorage.getItem('Token');
    this.isAdmin = localStorage.getItem('Admin') === 'true';
  }

  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('Email');
    localStorage.removeItem('Admin');
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/']);
  }
}