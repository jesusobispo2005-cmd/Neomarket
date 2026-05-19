// product-filter.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {

  searchText: string = '';
  category: string = '';
  categorias = ['Electronica', 'Ropa', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Otros'];

  @Output() filterChange = new EventEmitter<{ search: string; category: string }>();

  onSearchChange() {
    this.filterChange.emit({ search: this.searchText, category: this.category });
  }

  onCategoryChange() {
    this.filterChange.emit({ search: this.searchText, category: this.category });
  }
}