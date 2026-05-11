import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../../../services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(
    private router: Router,
    public wishlistService: WishlistService
  ) {}

  viewProduct() {
    this.router.navigate(['/producto', this.product._id]);
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    this.wishlistService.toggle(this.product);
  }
}