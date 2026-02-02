import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SalesOrderService } from '../../../core/services/sales-order.service';
import { TableColumn } from '../../../shared/components/data-table.component';
import { SalesOrder } from '../../../shared/models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: false,
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  orders: SalesOrder[] = [];
  loading = false;

  columns: TableColumn[] = [
    { key: 'id', label: 'Order ID' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'totalAmount', label: 'Total Amount' } 
  ];

  constructor(
    private salesOrderService: SalesOrderService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.salesOrderService.getMyOrders()
      .subscribe({
        next: (data) => {
          this.orders = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load orders', err);
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }
}
