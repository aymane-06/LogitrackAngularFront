import { Component, OnInit } from '@angular/core';
import { TableAction, TableColumn } from '../../../shared/components/data-table/data-table';

interface Warehouse {
  id?: number;
  name: string;
  code: string;
  location: string;
  capacity: number;
  currentStock: number;
  manager: string;
  status: string;
}

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.html',
  styleUrls: ['./warehouses.css'],
  standalone: false
})
export class Warehouses implements OnInit {
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Warehouse Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: true },
    { key: 'currentStock', label: 'Current Stock', sortable: true },
    { key: 'manager', label: 'Manager', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: '✏️', action: (row) => this.editWarehouse(row), color: 'primary' },
    { label: 'View', icon: '👁️', action: (row) => this.viewWarehouse(row), color: 'warning' },
    { label: 'Delete', icon: '🗑️', action: (row) => this.deleteWarehouse(row), color: 'danger' }
  ];

  warehouses: Warehouse[] = [
    { id: 1, name: 'Main Warehouse', code: 'WH-001', location: 'New York, NY', capacity: 10000, currentStock: 7500, manager: 'John Smith', status: 'Active' },
    { id: 2, name: 'North Warehouse', code: 'WH-002', location: 'Boston, MA', capacity: 8000, currentStock: 5200, manager: 'Sarah Johnson', status: 'Active' },
    { id: 3, name: 'South Warehouse', code: 'WH-003', location: 'Miami, FL', capacity: 6000, currentStock: 5800, manager: 'Mike Davis', status: 'Nearly Full' },
    { id: 4, name: 'West Warehouse', code: 'WH-004', location: 'Los Angeles, CA', capacity: 12000, currentStock: 3000, manager: 'Emily Brown', status: 'Active' }
  ];

  loading = false;
  isModalOpen = false;
  selectedWarehouse?: Warehouse;

  ngOnInit(): void {
    // Load warehouses from API
  }

  getActiveWarehousesCount(): number {
    return this.warehouses.filter(w => w.status === 'Active').length;
  }

  getTotalCapacity(): number {
    return this.warehouses.reduce((sum, w) => sum + w.capacity, 0);
  }

  getTotalCurrentStock(): number {
    return this.warehouses.reduce((sum, w) => sum + w.currentStock, 0);
  }

  editWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouse = warehouse;
    this.isModalOpen = true;
  }

  viewWarehouse(warehouse: Warehouse): void {
    console.log('View warehouse:', warehouse);
    // Navigate to warehouse detail page
  }

  deleteWarehouse(warehouse: Warehouse): void {
    if (confirm(`Are you sure you want to delete ${warehouse.name}?`)) {
      this.warehouses = this.warehouses.filter(w => w.id !== warehouse.id);
      console.log('Warehouse deleted:', warehouse);
    }
  }

  onRowClick(warehouse: Warehouse): void {
    console.log('Warehouse clicked:', warehouse);
    // Navigate to warehouse detail page
  }

  addWarehouse(): void {
    this.selectedWarehouse = undefined;
    this.isModalOpen = true;
  }

  onModalClose(): void {
    this.isModalOpen = false;
    this.selectedWarehouse = undefined;
  }

  onWarehouseSave(warehouse: Warehouse): void {
    if (warehouse.id) {
      // Update existing warehouse
      const index = this.warehouses.findIndex(w => w.id === warehouse.id);
      if (index !== -1) {
        this.warehouses[index] = warehouse;
      }
    } else {
      // Create new warehouse
      const maxId = Math.max(0, ...this.warehouses.map(w => w.id || 0));
      const newWarehouse = {
        ...warehouse,
        id: maxId + 1
      };
      this.warehouses = [...this.warehouses, newWarehouse];
    }
    this.onModalClose();
  }

  getUtilization(warehouse: Warehouse): number {
    return Math.round((warehouse.currentStock / warehouse.capacity) * 100);
  }
}
