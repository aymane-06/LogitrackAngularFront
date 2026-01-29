import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../../core/services/purchase-order.service';
import { PurchaseOrder } from '../../../shared/models/purchase-order.model';

@Component({
  selector: 'app-purchase-orders',
  standalone: false,
  templateUrl: './purchase-orders.html',
  styleUrl: './purchase-orders.css',
})
export class PurchaseOrders implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  loading = false;
  error = '';

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.purchaseOrderService.getAll().subscribe({
      next: (orders) => {
        this.purchaseOrders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load purchase orders';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
