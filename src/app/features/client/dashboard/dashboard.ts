import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { SalesOrderService } from '../../../core/services/sales-order.service';
import { SalesOrder } from '../../../shared/models/order.model';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  orders: SalesOrder[] = [];
  loading = false;
  
  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0
  };

  constructor(
    private salesOrderService: SalesOrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    } else {
      this.loading = false; // Ensure not loading on server
    }
  }
  
  logout(): void {
      this.store.dispatch(AuthActions.logout());
  }

  loadData(): void {
    this.loading = true;
    this.salesOrderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.calculateStats();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  calculateStats(): void {
    this.stats.totalOrders = this.orders.length;
    this.stats.pendingOrders = this.orders.filter(o => 
      ['CREATED', 'APPROVED', 'RESERVED', 'SHIPPED'].includes(o.status)).length;
    this.stats.deliveredOrders = this.orders.filter(o => o.status === 'DELIVERED').length;
    this.stats.totalSpent = this.orders.reduce((sum, order) => {
      const orderTotal = order.lines.reduce((lineSum, line) => lineSum + (line.quantity * line.unitPrice), 0);
      return sum + orderTotal;
    }, 0);
  }
}
