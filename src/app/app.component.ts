import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  cartCount = 0;
  wishlistCount = 0;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCount();
    });
    this.wishlistService.wishlist$.subscribe(() => {
      this.wishlistCount = this.wishlistService.getCount();
    });
  }
}