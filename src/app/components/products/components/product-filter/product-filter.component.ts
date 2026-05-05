import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {

  searchText = '';
  category = '';

  @Output() filterChange = new EventEmitter<any>();

  onSearchChange() {
    this.emitFilters();
  }

  onCategoryChange() {
    this.emitFilters();
  }

  emitFilters() {
    this.filterChange.emit({
      search: this.searchText,
      category: this.category
    });
  }
}