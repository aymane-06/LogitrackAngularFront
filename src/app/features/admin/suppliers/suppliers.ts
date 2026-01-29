import { ChangeDetectorRef, Component, OnInit, afterNextRender } from '@angular/core';
import { SupplierService } from '../../../core/services/supplier.service';
import { ToastService } from '../../../core/services/toast.service';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';
import { Supplier } from '../../../shared/models/supplier.model';

// Extended interface for UI - includes fields not in backend model
interface SupplierUI extends Supplier {
  code?: string;
  contact?: string;
  email?: string;
  phone?: string;
  category?: string;
  rating?: number;
  status?: string;
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.html',
  styleUrls: ['./suppliers.css'],
  standalone: false
})
export class Suppliers implements OnInit {
  columns: TableColumn[] = [

    { key: 'name', label: 'Supplier Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'contact', label: 'Contact Person', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: '✏️', handler: (row: any) => this.editSupplier(row), class: 'text-blue-600' },
    { label: 'View', icon: '👁️', handler: (row: any) => this.viewSupplier(row), class: 'text-yellow-600' },
    { label: 'Delete', icon: '🗑️', handler: (row: any) => this.deleteSupplier(row), class: 'text-red-600' }
  ];

  suppliers: SupplierUI[] = [];

  loading = false;
  isModalOpen = false;
  selectedSupplier?: SupplierUI;

  constructor(
    private supplierService: SupplierService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.loadSuppliers();
    });
  }

  ngOnInit(): void {
  }

  loadSuppliers(): void {
    this.loading = true;
    this.supplierService.getAll().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.toastService.error('Failed to load suppliers');
        this.loading = false;
      }
    });
  }

  getActiveSuppliersCount(): number {
    return this.suppliers.filter(s => s.status === 'Active').length;
  }

  getPendingSuppliersCount(): number {
    return this.suppliers.filter(s => s.status === 'Pending').length;
  }

  editSupplier(supplier: SupplierUI): void {
    this.selectedSupplier = supplier;
    this.isModalOpen = true;
  }

  viewSupplier(supplier: SupplierUI): void {
    console.log('View supplier:', supplier);
    // Navigate to supplier detail page
  }

  deleteSupplier(supplier: SupplierUI): void {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      this.loading = true;
      this.supplierService.delete(supplier.id).subscribe({
        next: () => {
          this.suppliers = this.suppliers.filter(s => s.id !== supplier.id);
          this.toastService.success('Supplier deleted successfully');
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
          this.toastService.error('Failed to delete supplier');
          this.loading = false;
        }
      });
    }
  }

  onRowClick(supplier: Supplier): void {
    console.log('Supplier clicked:', supplier);
    // Navigate to supplier detail page
  }

  addSupplier(): void {
    this.selectedSupplier = undefined;
    this.isModalOpen = true;
  }

  onModalClose(): void {
    this.isModalOpen = false;
    this.selectedSupplier = undefined;
  }

  onSupplierSave(supplier: any): void {
    this.loading = true;
    if (supplier.id) {
      // Update existing supplier - map UI fields to DTO
      const supplierDTO = { name: supplier.name, contactInfo: supplier.contact || '' };
      this.supplierService.update(supplier.id, supplierDTO).subscribe({
        next: (updatedSupplier) => {
          const index = this.suppliers.findIndex(s => s.id === supplier.id);
          if (index !== -1) {
            // Preserve UI fields
            this.suppliers[index] = { ...supplier, ...updatedSupplier };
          }
          this.toastService.success('Supplier updated successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating supplier:', error);
          this.toastService.error('Failed to update supplier');
          this.loading = false;
        }
      });
    } else {
      // Create new supplier - map UI fields to DTO
      const supplierDTO = { name: supplier.name, contactInfo: supplier.contact || '' };
      this.supplierService.create(supplierDTO).subscribe({
        next: (newSupplier) => {
          // Combine backend response with UI fields
          this.suppliers = [...this.suppliers, { ...supplier, ...newSupplier }];
          this.toastService.success('Supplier created successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating supplier:', error);
          this.toastService.error('Failed to create supplier');
          this.loading = false;
        }
      });
    }
  }

  getAverageRating(): number {
    if (this.suppliers.length === 0) return 0;
    const sum = this.suppliers.reduce((acc: number, s: any) => acc + (s.rating || 0), 0);
    return Math.round((sum / this.suppliers.length) * 10) / 10;
  }
}

