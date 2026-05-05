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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    // 🔥 IMPORTANTE: reutiliza cambios de ruta
    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      console.log('ID recibido:', id);

      if (!id) return;

      this.product = null; // reset visual

      this.productService.getById(id).subscribe({
        next: (res: any) => {
          console.log('PRODUCTO OK:', res);

          // 🔥 CLAVE: forzar cambio de referencia Angular
          this.product = structuredClone(res);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
        }
      });

    });
  }
}