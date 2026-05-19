import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../../../services/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product: any;

  enWishlist = false;
  private sub!: Subscription;

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
  ) {}

  ngOnInit() {
    // Se suscribe al observable: cada vez que cambia la wishlist, recalcula
    this.sub = this.wishlistService.wishlist$.subscribe(() => {
      this.enWishlist = this.wishlistService.estaEnWishlist(this.product._id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  verProducto() {
    this.router.navigate(['/producto', this.product._id]);
  }

  async toggleWishlist(event: Event) {
    event.stopPropagation();
    const email = localStorage.getItem('Email');
    if (!email) {
      this.router.navigate(['/login']);
      return;
    }
    await this.wishlistService.getByEmail(localStorage.getItem('Email') || '').subscribe(
      (response: any) => {
        // Reset form
        console.log('Wishlist response:', response.Wishlist);
        this.wishlistService.wishlistSubject.next(response.Wishlist || []);

        let fakeWishlist = this.wishlistService.wishlistSubject.value;
        console.log('First Wishlist:', fakeWishlist);
        fakeWishlist.push(this.product);
        console.log('Current Wishlist:', fakeWishlist);
        this.wishlistService.wishlistSubject.next(fakeWishlist);

        this.wishlistService
          .updateWishlist(localStorage.getItem('Email') || '', { Wishlist: this.wishlistService.wishlistSubject.value })
          .subscribe(
            (response: any) => {
              console.log('Wishlist updated successfully:', response);
            },
            (error: any) => {
              console.error('Something wrong:', error);
            },
          );

        event.stopPropagation();
        this.wishlistService.toggle(localStorage.getItem('Email') || '', this.product);
      },
      (error: any) => {
        console.error('Something wrong:', error);
      },
    );
  }
}
