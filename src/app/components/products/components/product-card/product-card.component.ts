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

  toggleWishlist(event: Event) {
    event.stopPropagation();
    const email = localStorage.getItem('Email');
    if (!email) {
      this.router.navigate(['/login']);
      return;
    }
    this.wishlistService.toggle(email, this.product);
  }
}