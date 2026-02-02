import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);

  stats = {
    pendingOrders: 0,
    lowStockItems: 0,
    totalItems: 0,
    incomingShipments: 0
  };

  recentOrders: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loading = true;
    
    // Purchase Orders and Inventory data loading removed as per user request to load only on component access
    // Stats will remain 0 until a dedicated stats endpoint is available
    
    this.loading = false;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CREATED': return 'bg-gray-100 text-gray-800';
      case 'APPROVED': return 'bg-blue-100 text-blue-800';
      case 'RECEIVED': return 'bg-green-100 text-green-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
