import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../../../core/services/purchase-order.service';
import { ToastService } from '../../../core/services/toast.service';
import { TableAction, TableColumn } from '../../../shared/components/data-table.component';
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

  columns: TableColumn[] = [
    { key: 'id', label: 'Order ID' },
    { key: 'supplier.name', label: 'Supplier' },
    { key: 'warehouse.name', label: 'Warehouse' },
    { key: 'status', label: 'Status' },
    { key: 'expectedDelivery', label: 'Expected Delivery' },
    { key: 'createdAt', label: 'Created At' }
  ];

  actions: TableAction[] = [
    { label: 'View', icon: 'eye', handler: (item) => this.viewOrder(item) },
    { label: 'Edit', icon: 'edit', handler: (item) => this.editOrder(item) },
    { 
      label: 'Approve', 
      icon: 'check-circle', 
      handler: (item) => this.updateStatus(item, 'APPROVED'),
      condition: (item) => item.status === 'CREATED'
    },
    { 
      label: 'Receive', 
      icon: 'archive', 
      handler: (item) => this.updateStatus(item, 'RECEIVED'),
      condition: (item) => item.status === 'APPROVED'
    }
  ];

  isModalOpen = false;
  selectedOrder: PurchaseOrder | null = null;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.purchaseOrderService.getAll().subscribe({
      next: (orders) => {
        this.purchaseOrders = orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Failed to load purchase orders');
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  viewOrder(order: PurchaseOrder) {
    this.toastService.info(`Viewing order ${order.id}`);
  }

  updateStatus(order: PurchaseOrder, status: string) {
    if (!confirm(`Are you sure you want to mark this order as ${status}?`)) return;
    
    this.loading = true;
    this.purchaseOrderService.updateStatus(order.id, status).subscribe({
      next: () => {
        this.toastService.success(`Order marked as ${status}`);
        this.loadOrders();
      },
      error: (err) => {
        this.toastService.error(`Failed to update status to ${status}`);
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editOrder(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  openNewOrderModal() {
    this.selectedOrder = null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  onSaveOrder(orderData: any) {
    this.loading = true;
    if (this.selectedOrder) {
      this.purchaseOrderService.update(this.selectedOrder.id, orderData).subscribe({
        next: () => {
          this.toastService.success('Order updated successfully');
          this.closeModal();
          this.loadOrders();
        },
        error: (err) => {
          this.toastService.error('Failed to update order');
          this.loading = false;
          console.error(err);
          this.cdr.detectChanges();
        }
      });
    } else {
      this.purchaseOrderService.create(orderData).subscribe({
        next: () => {
          this.toastService.success('Order created successfully');
          this.closeModal();
          this.loadOrders();
        },
        error: (err) => {
          this.toastService.error('Failed to create order');
          this.loading = false;
          console.error(err);
          this.cdr.detectChanges();
        }
      });
    }
  }
}
