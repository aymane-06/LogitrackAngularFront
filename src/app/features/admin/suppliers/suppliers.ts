import { Component, OnInit } from '@angular/core';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';

interface Supplier {
  id?: number;
  name: string;
  code: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  status: string;
}

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.html',
  styleUrls: ['./suppliers.css'],
  standalone: false
})
export class Suppliers implements OnInit {
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
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

  suppliers: Supplier[] = [
    { id: 1, name: 'Tech Solutions Inc.', code: 'SUP-001', contact: 'Robert Wilson', email: 'robert@techsolutions.com', phone: '+1-555-0101', category: 'Electronics', rating: 4.8, status: 'Active' },
    { id: 2, name: 'Office Furniture Co.', code: 'SUP-002', contact: 'Linda Martinez', email: 'linda@officefurniture.com', phone: '+1-555-0102', category: 'Furniture', rating: 4.5, status: 'Active' },
    { id: 3, name: 'Global Logistics Ltd.', code: 'SUP-003', contact: 'James Anderson', email: 'james@globallogistics.com', phone: '+1-555-0103', category: 'Logistics', rating: 4.2, status: 'Active' },
    { id: 4, name: 'Smart Devices Corp.', code: 'SUP-004', contact: 'Maria Garcia', email: 'maria@smartdevices.com', phone: '+1-555-0104', category: 'Electronics', rating: 3.9, status: 'Pending' }
  ];

  loading = false;
  isModalOpen = false;
  selectedSupplier?: Supplier;

  ngOnInit(): void {
    // Load suppliers from API
  }

  getActiveSuppliersCount(): number {
    return this.suppliers.filter(s => s.status === 'Active').length;
  }

  getPendingSuppliersCount(): number {
    return this.suppliers.filter(s => s.status === 'Pending').length;
  }

  editSupplier(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.isModalOpen = true;
  }

  viewSupplier(supplier: Supplier): void {
    console.log('View supplier:', supplier);
    // Navigate to supplier detail page
  }

  deleteSupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      this.suppliers = this.suppliers.filter(s => s.id !== supplier.id);
      console.log('Supplier deleted:', supplier);
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

  onSupplierSave(supplier: Supplier): void {
    if (supplier.id) {
      // Update existing supplier
      const index = this.suppliers.findIndex(s => s.id === supplier.id);
      if (index !== -1) {
        this.suppliers[index] = supplier;
      }
    } else {
      // Create new supplier
      const maxId = Math.max(0, ...this.suppliers.map(s => s.id || 0));
      const newSupplier = {
        ...supplier,
        id: maxId + 1
      };
      this.suppliers = [...this.suppliers, newSupplier];
    }
    this.onModalClose();
  }

  getAverageRating(): number {
    if (this.suppliers.length === 0) return 0;
    const sum = this.suppliers.reduce((acc, s) => acc + s.rating, 0);
    return Math.round((sum / this.suppliers.length) * 10) / 10;
  }
}
