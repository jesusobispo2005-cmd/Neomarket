import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  items: any[] = [];
  addedToCart: { [id: string]: boolean } = {};

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.wishlistService.wishlist$.subscribe(items => {
      this.items = items;
    });
  }

  remove(productId: string) {
    this.wishlistService.remove(productId);
  }

  addToCart(product: any) {
    this.cartService.addToCart(product, 1);
    this.addedToCart[product._id] = true;
    setTimeout(() => {
      this.addedToCart[product._id] = false;
    }, 1800);
  }

  viewProduct(id: string) {
    this.router.navigate(['/producto', id]);
  }
}