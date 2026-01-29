import { ChangeDetectorRef, Component, OnInit, afterNextRender } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';
import { Warehouse } from '../../../shared/models/warehouse.model';

// Extended interface for UI - includes fields not in backend model
interface WarehouseUI extends Warehouse {
  manager?: string;
  status?: string;
}

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.html',
  styleUrls: ['./warehouses.css'],
  standalone: false
})
export class Warehouses implements OnInit {
  columns: TableColumn[] = [

    { key: 'name', label: 'Warehouse Name', sortable: true },
    { key: 'code', label: 'Code', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'manager', label: 'Manager', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'Edit', icon: '✏️', handler: (row: any) => this.editWarehouse(row), class: 'text-blue-600' },
    { label: 'View', icon: '👁️', handler: (row: any) => this.viewWarehouse(row), class: 'text-yellow-600' },
    { label: 'Delete', icon: '🗑️', handler: (row: any) => this.deleteWarehouse(row), class: 'text-red-600' }
  ];

  warehouses: WarehouseUI[] = [];

  loading = false;
  isModalOpen = false;
  selectedWarehouse?: WarehouseUI;

  constructor(
    private warehouseService: WarehouseService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.loadWarehouses();
    });
  }

  ngOnInit(): void {
  }

  loadWarehouses(): void {
    this.loading = true;
    this.warehouseService.getAll().subscribe({
      next: (warehouses: any[]) => {
        this.warehouses = warehouses.map(w => ({
          ...w,
          manager: w.warehouse_manager?.name || 'N/A',
          status: w.active ? 'Active' : 'Inactive'
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.toastService.error('Failed to load warehouses');
        this.loading = false;
      }
    });
  }

  getActiveWarehousesCount(): number {
    return this.warehouses.filter(w => w.status === 'Active').length;
  }



  editWarehouse(warehouse: WarehouseUI): void {
    this.selectedWarehouse = warehouse;
    this.isModalOpen = true;
  }

  viewWarehouse(warehouse: WarehouseUI): void {
    console.log('View warehouse:', warehouse);
    // Navigate to warehouse detail page
  }

  deleteWarehouse(warehouse: WarehouseUI): void {
    if (confirm(`Are you sure you want to delete ${warehouse.name}?`)) {
      this.loading = true;
      this.warehouseService.delete(warehouse.id).subscribe({
        next: () => {
          this.warehouses = this.warehouses.filter(w => w.id !== warehouse.id);
          this.toastService.success('Warehouse deleted successfully');
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting warehouse:', error);
          this.toastService.error('Failed to delete warehouse');
          this.loading = false;
        }
      });
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

  onWarehouseSave(warehouse: any): void {
    this.loading = true;
    if (warehouse.id) {
      // Update existing warehouse - map UI fields to DTO
      const warehouseDTO = { 
        name: warehouse.name, 
        location: warehouse.location, 
        warehouseManagerId: warehouse.warehouseManagerId,
        active: warehouse.active 
      };
      this.warehouseService.update(warehouse.id, warehouseDTO).subscribe({
        next: (updatedWarehouse) => {
          const index = this.warehouses.findIndex(w => w.id === warehouse.id);
          if (index !== -1) {
            // Preserve UI fields
            this.warehouses[index] = { ...warehouse, ...updatedWarehouse };
          }
          this.toastService.success('Warehouse updated successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating warehouse:', error);
          this.toastService.error('Failed to update warehouse');
          this.loading = false;
        }
      });
    } else {
      // Create new warehouse - map UI fields to DTO
      const warehouseDTO = { 
        name: warehouse.name, 
        location: warehouse.location, 
        warehouseManagerId: warehouse.warehouseManagerId,
        active: warehouse.active 
      };
      this.warehouseService.create(warehouseDTO).subscribe({
        next: (newWarehouse) => {
          // Combine backend response with UI fields
          this.warehouses = [...this.warehouses, { ...warehouse, ...newWarehouse }];
          this.toastService.success('Warehouse created successfully');
          this.onModalClose();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating warehouse:', error);
          this.toastService.error('Failed to create warehouse');
          this.loading = false;
        }
      });
    }
  }


}
