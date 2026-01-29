import { ChangeDetectorRef, Component, OnInit, afterNextRender } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';
import { Product } from '../../../shared/models/product.model';

// Extended interface for UI - includes fields not in backend model
interface ProductUI extends Product {
  price?: number;
  stock?: number;
  warehouse?: string;
  status?: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: false
})
export class Products implements OnInit {
  columns: TableColumn[] = [

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

  products: ProductUI[] = [];

  loading = false;
  isModalOpen = false;
  selectedProduct?: ProductUI;

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.loadProducts();
    });
  }

  ngOnInit(): void {
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (products: any[]) => {
        this.products = products.map(p => ({
          ...p,
          price: p.boughtPrice,
          stock: 0, // Not available in Product DTO
          warehouse: 'Multiple', // Not available in Product DTO
          status: p.active ? 'Active' : 'Inactive'
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.toastService.error('Failed to load products');
        this.loading = false;
      }
    });
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

  editProduct(product: ProductUI): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  viewProduct(product: ProductUI): void {
    console.log('View product:', product);
    // Navigate to product detail page
  }

  deleteProduct(product: ProductUI): void {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      if (!product.sku) {
        this.toastService.error('Cannot delete product: SKU is missing');
        return;
      }
      this.loading = true;
      this.productService.delete(product.sku).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.sku !== product.sku);
          this.toastService.success('Product deleted successfully');
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.toastService.error('Failed to delete product');
          this.loading = false;
        }
      });
    }
  }

  onRowClick(product: ProductUI): void {
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

  onProductSave(product: any): void {
    this.loading = true;
    
    if (product.id) {
      // Update existing product - map UI fields to DTO
      const productDTO = { 
        name: product.name, 
        category: product.category, 
        boughtPrice: product.price || 0, 
        active: product.status === 'In Stock' 
      };
      // Use SKU if available, otherwise fallback to ID (though backend expects SKU)
      const identifier = product.sku || product.id;
      this.productService.update(identifier, productDTO).subscribe({
        next: (updatedProduct) => {
          const index = this.products.findIndex(p => p.id === product.id);
          if (index !== -1) {
            // Preserve UI fields
            this.products[index] = { ...product, ...updatedProduct };
          }
          this.toastService.success('Product updated successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.toastService.error('Failed to update product');
          this.loading = false;
        }
      });
    } else {
      // Create new product - map UI fields to DTO
      const productDTO = { 
        name: product.name, 
        category: product.category, 
        boughtPrice: product.price || 0, 
        active: true 
      };
      this.productService.create(productDTO).subscribe({
        next: (newProduct) => {
          // Combine backend response with UI fields
          this.products = [...this.products, { ...product, ...newProduct }];
          this.toastService.success('Product created successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.toastService.error('Failed to create product');
          this.loading = false;
        }
      });
    }
  }
}
