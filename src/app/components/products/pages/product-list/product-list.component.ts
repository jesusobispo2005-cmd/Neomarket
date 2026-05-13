import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../products/services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductFilterComponent } from '../../components/product-filter/product-filter.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductFilterComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {

    this.productService.getAll().subscribe({
      next: (res: any) => {
        this.products = res || [];
        this.filteredProducts = res || [];
      },
      error: (err) => {
        console.log('Error API:', err);
        this.products = [];
        this.filteredProducts = [];
      },
    });

  }

  onFilterChange(filters: any) {
    this.filteredProducts = this.products.filter((p) => {
      const matchSearch = p.Nombre.toLowerCase().includes(filters.search.toLowerCase());

      const matchCategory =
        !filters.category || p.Categoria?.toLowerCase() === filters.category.toLowerCase();

      return matchSearch && matchCategory;
    });
  }

}
