import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../core/services/inventory.service';
import { ToastService } from '../../../core/services/toast.service';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';
import { Inventory as InventoryModel } from '../../../shared/models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  inventoryItems: InventoryModel[] = [];
  loading = false;

  columns: TableColumn[] = [
    { key: 'product.sku', label: 'SKU' },
    { key: 'product.name', label: 'Product Name' },
    { key: 'warehouse.name', label: 'Warehouse' },
    { key: 'qtyOnHand', label: 'On Hand' },
    { key: 'qtyReserved', label: 'Reserved' },
    { key: 'updatedAt', label: 'Last Updated' }
  ];

  actions: TableAction[] = [
    { label: 'Adjust', icon: 'edit', handler: (item) => this.adjustStock(item) }
  ];

  constructor(
    private inventoryService: InventoryService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.inventoryItems = items;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Failed to load inventory');
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  adjustStock(item: InventoryModel) {
    console.log('Adjust stock', item);
    this.toastService.info('Adjust Stock functionality coming soon');
  }
}
