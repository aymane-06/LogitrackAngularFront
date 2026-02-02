import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../../../core/services/sales-order.service';
import { ToastService } from '../../../core/services/toast.service';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';
import { SalesOrder } from '../../../shared/models/order.model';

@Component({
  selector: 'app-sales-orders',
  standalone: false,
  templateUrl: './sales-orders.html',
  styleUrl: './sales-orders.css',
})
export class SalesOrders implements OnInit {
  salesOrders: SalesOrder[] = [];
  loading = false;

  columns: TableColumn[] = [
    { key: 'id', label: 'Order ID' },
    { key: 'client.name', label: 'Client' },
    { key: 'warehouse.name', label: 'Warehouse' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created At' }
  ];

  actions: TableAction[] = [
    { label: 'Fulfill', icon: 'check', handler: (item) => this.fulfillOrder(item) },
    { label: 'View', icon: 'eye', handler: (item) => this.viewOrder(item) }
  ];

  constructor(
    private salesOrderService: SalesOrderService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.salesOrderService.getAll().subscribe({
      next: (orders) => {
        this.salesOrders = orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Failed to load sales orders');
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  fulfillOrder(order: SalesOrder) {
    console.log('Fulfill order', order);
    this.toastService.info(`Fulfillment for order ${order.id} started`);
  }

  viewOrder(order: SalesOrder) {
    console.log('View order', order);
    this.toastService.info(`Viewing order ${order.id}`);
  }
}
