import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  class?: string;
  handler: (item: any) => void;
  condition?: (item: any) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: false,
  template: `
    <div class="overflow-x-auto">
      <div *ngIf="searchable" class="mb-4">
        <input 
          type="text" 
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange()"
          placeholder="Search..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th *ngFor="let column of columns"
                [style.width]="column.width"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                (click)="column.sortable !== false && onSort(column.key)">
              <div class="flex items-center">
                {{ column.label }}
                <span *ngIf="column.sortable !== false && sortColumn === column.key" class="ml-2">
                  <svg *ngIf="sortDirection === 'asc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                  </svg>
                  <svg *ngIf="sortDirection === 'desc'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                  </svg>
                </span>
              </div>
            </th>
            <th *ngIf="actions && actions.length > 0" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngIf="loading" class="text-center">
            <td [attr.colspan]="columns.length + (actions?.length ? 1 : 0)" class="px-6 py-4">
              <app-loading-spinner [size]="32" message="Loading..."></app-loading-spinner>
            </td>
          </tr>
          <tr *ngIf="!loading && filteredData.length === 0" class="text-center">
            <td [attr.colspan]="columns.length + (actions?.length ? 1 : 0)" class="px-6 py-4 text-gray-500">
              No data available
            </td>
          </tr>
          <tr *ngFor="let item of paginatedData" class="hover:bg-gray-50">
            <td *ngFor="let column of columns" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ getNestedValue(item, column.key) }}
            </td>
            <td *ngIf="actions && actions.length > 0" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <ng-container *ngFor="let action of actions">
                <button *ngIf="!action.condition || action.condition(item)"
                        (click)="action.handler(item)"
                        [class]="action.class || 'text-blue-600 hover:text-blue-900 ml-4'">
                  {{ action.label }}
                </button>
              </ng-container>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div *ngIf="paginate && filteredData.length > pageSize" class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredData.length) }} of {{ filteredData.length }} results
        </div>
        <div class="flex gap-2">
          <button 
            (click)="goToPage(currentPage - 1)"
            [disabled]="currentPage === 1"
            class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Previous
          </button>
          <button 
            *ngFor="let page of visiblePages"
            (click)="goToPage(page)"
            [class.bg-blue-600]="page === currentPage"
            [class.text-white]="page === currentPage"
            class="px-3 py-1 border rounded hover:bg-gray-50">
            {{ page }}
          </button>
          <button 
            (click)="goToPage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  `
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions?: TableAction[];
  @Input() loading = false;
  @Input() searchable = true;
  @Input() paginate = true;
  @Input() pageSize = 10;
  
  @Output() sortChanged = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  Math = Math;
  private sortedData: any[] = [];

  get displayData(): any[] {
    // Use sorted data if sorting is applied, otherwise use original data
    return this.sortColumn ? this.sortedData : this.data;
  }

  get filteredData(): any[] {
    const dataToFilter = this.displayData;
    
    if (!this.searchTerm) {
      return dataToFilter;
    }
    
    const term = this.searchTerm.toLowerCase();
    return dataToFilter.filter(item => 
      this.columns.some(column => {
        const value = this.getNestedValue(item, column.key);
        return value?.toString().toLowerCase().includes(term);
      })
    );
  }

  get paginatedData(): any[] {
    if (!this.paginate) {
      return this.filteredData;
    }
    
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range: number[] = [];
    
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    
    if (current - delta > 2) {
      range.unshift(-1);
    }
    if (current + delta < total - 1) {
      range.push(-1);
    }
    
    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }
    
    return range.filter((v, i, a) => a.indexOf(v) === i && v !== -1);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    // Create a sorted copy instead of mutating the original
    this.sortedData = [...this.data].sort((a, b) => {
      const aVal = this.getNestedValue(a, column);
      const bVal = this.getNestedValue(b, column);
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    this.sortChanged.emit({ column, direction: this.sortDirection });
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
