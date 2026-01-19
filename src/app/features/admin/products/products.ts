import { Component, OnInit } from '@angular/core';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';

interface Product {
  id?: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  warehouse: string;
  status: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: false
})
export class Products implements OnInit {
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'stock', label: 'Stock', sortable: true },
    { key: 'warehouse', label: 'Warehouse', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: '✏️', handler: (row: any) => this.editProduct(row), class: 'text-blue-600' },
    { label: 'View', icon: '👁️', handler: (row: any) => this.viewProduct(row), class: 'text-yellow-600' },
    { label: 'Delete', icon: '🗑️', handler: (row: any) => this.deleteProduct(row), class: 'text-red-600' }
  ];

  products: Product[] = [
    { id: 1, name: 'Laptop Pro', sku: 'LAP-001', category: 'Electronics', price: 1299.99, stock: 45, warehouse: 'Main Warehouse', status: 'In Stock' },
    { id: 2, name: 'Office Chair', sku: 'FUR-002', category: 'Furniture', price: 299.99, stock: 120, warehouse: 'North Warehouse', status: 'In Stock' },
    { id: 3, name: 'Smartphone X', sku: 'PHO-003', category: 'Electronics', price: 899.99, stock: 5, warehouse: 'Main Warehouse', status: 'Low Stock' },
    { id: 4, name: 'Desk Lamp', sku: 'LIT-004', category: 'Lighting', price: 49.99, stock: 0, warehouse: 'South Warehouse', status: 'Out of Stock' }
  ];

  loading = false;
  isModalOpen = false;
  selectedProduct?: Product;

  ngOnInit(): void {
    // Load products from API
  }

  getInStockCount(): number {
    return this.products.filter(p => p.status === 'In Stock').length;
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.status === 'Low Stock').length;
  }

  getOutOfStockCount(): number {
    return this.products.filter(p => p.status === 'Out of Stock').length;
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  viewProduct(product: Product): void {
    console.log('View product:', product);
    // Navigate to product detail page
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.products = this.products.filter(p => p.id !== product.id);
      console.log('Product deleted:', product);
    }
  }

  onRowClick(product: Product): void {
    console.log('Product clicked:', product);
    // Navigate to product detail page
  }

  addProduct(): void {
    this.selectedProduct = undefined;
    this.isModalOpen = true;
  }

  onModalClose(): void {
    this.isModalOpen = false;
    this.selectedProduct = undefined;
  }

  onProductSave(product: Product): void {
    if (product.id) {
      // Update existing product
      const index = this.products.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.products[index] = product;
      }
    } else {
      // Create new product
      const maxId = Math.max(0, ...this.products.map(p => p.id || 0));
      const newProduct = {
        ...product,
        id: maxId + 1
      };
      this.products = [...this.products, newProduct];
    }
    this.onModalClose();
  }
}
