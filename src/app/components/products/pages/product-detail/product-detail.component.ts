import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: any = null;
  cantidad: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.product = null;
      this.cantidad = 1;

      this.productService.getById(id).subscribe({
        next: (res: any) => {
          this.product = structuredClone(res);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
        }
      });
    });
  }

  increment() {
    if (this.cantidad < this.product.Stock) {
      this.cantidad++;
    }
  }

  decrement() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
}