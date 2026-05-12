import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlistItems = signal<any[]>([]);
  addedToCart: { [id: string]: boolean } = {};

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router,
  ) {}

  async ngOnInit() {
    /*
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlistItems = items;
    });
    */

    if (!localStorage.getItem('Email')) {
      console.log('No email found in localStorage. Redirecting to login page.');
      this.router.navigate(['/login']);
      return;
    } else {
      await this.wishlistService.getByEmail(localStorage.getItem('Email') || '').subscribe(
        (response: any) => {
          // Reset form
          console.log('Wishlist response:', response);
          this.wishlistItems.set(response.Wishlist || ['Salio mal']);
        },
        (error: any) => {
          console.error('Something wrong:', error);
        },
      );
    }

    console.log('Wishlist items:', this.wishlistItems);
  }

  async remove(productId: string) {
    this.wishlistService.remove(productId);

    let fakeWishlist = this.wishlistItems();
    const index = fakeWishlist.findIndex((item: any) => item._id === productId);
    if (index !== -1) {
      fakeWishlist.splice(index, 1);
      this.wishlistItems.set(fakeWishlist);
    }

    this.wishlistService
      .updateWishlist(localStorage.getItem('Email') || '', { Wishlist: this.wishlistItems() })
      .subscribe(
        (response: any) => {
          console.log('Wishlist updated successfully:', response);
        },
        (error: any) => {
          console.error('Something wrong:', error);
        },
      );
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
