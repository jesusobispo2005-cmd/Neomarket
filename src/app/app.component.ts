import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatboxComponent],
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

    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistCount = items.length;
    });

    this.isLoggedIn = !!localStorage.getItem('Token');
    this.isAdmin = localStorage.getItem('Admin') === 'true';

    const email = localStorage.getItem('Email');
    if (email) {
      this.wishlistService.cargar(email);
    }

    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoggedIn = !!localStorage.getItem('Token');
      this.isAdmin = localStorage.getItem('Admin') === 'true';
    });
  }

  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('Email');
    localStorage.removeItem('Admin');
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.wishlistService.limpiar();
    this.router.navigate(['/']);
  }
}