import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../../../services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(
    private router: Router,
    public wishlistService: WishlistService,
  ) {}

  Wishlist = signal<any[]>([]);

  viewProduct() {
    this.router.navigate(['/producto', this.product._id]);
  }
  /*
  toggleWishlist(event: Event) {
    event.stopPropagation();
    this.wishlistService.toggle(this.product);
  }
*/

  async wishlistItem(event: Event) {
    if (!localStorage.getItem('Email')) {
      console.log('No email found in localStorage. Redirecting to login page.');
      this.router.navigate(['/login']);
      return;
    } else {
      await this.wishlistService.getByEmail(localStorage.getItem('Email') || '').subscribe(
        (response: any) => {
          // Reset form
          console.log('Wishlist response:', response.Wishlist);
          this.Wishlist.set(response.Wishlist || []);

          let fakeWishlist = this.Wishlist();
          console.log('First Wishlist:', fakeWishlist);
          fakeWishlist.push(this.product);
          console.log('Current Wishlist:', fakeWishlist);
          this.Wishlist.set(fakeWishlist);

          this.wishlistService
            .updateWishlist(localStorage.getItem('Email') || '', { Wishlist: this.Wishlist() })
            .subscribe(
              (response: any) => {
                console.log('Wishlist updated successfully:', response);
              },
              (error: any) => {
                console.error('Something wrong:', error);
              },
            );

          event.stopPropagation();
          this.wishlistService.toggle(this.product);
        },
        (error: any) => {
          console.error('Something wrong:', error);
        },
      );
    }
  }
}
