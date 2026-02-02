import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../models/user.model';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  standalone: false
})
export class Sidebar {
  menuItems: MenuItem[] = [
    // Admin Routes
    { label: 'Dashboard', icon: '📊', route: '/admin', roles: [UserRole.ADMIN] },
    { label: 'Users', icon: '👥', route: '/admin/users', roles: [UserRole.ADMIN] },
    { label: 'Products', icon: '📦', route: '/admin/products', roles: [UserRole.ADMIN] },
    { label: 'Warehouses', icon: '🏢', route: '/admin/warehouses', roles: [UserRole.ADMIN] },
    { label: 'Suppliers', icon: '🤝', route: '/admin/suppliers', roles: [UserRole.ADMIN] },
    { label: 'Purchase Orders', icon: '📋', route: '/admin/purchase-orders', roles: [UserRole.ADMIN] },
    { label: 'Reports', icon: '📈', route: '/admin/reports', roles: [UserRole.ADMIN] },
    { label: 'Settings', icon: '⚙️', route: '/admin/settings', roles: [UserRole.ADMIN] },

    // Warehouse Manager Routes
    { label: 'Dashboard', icon: '📊', route: '/warehouse-manager', roles: [UserRole.WAREHOUSE_MANAGER] },
    { label: 'Purchase Orders', icon: '📋', route: '/warehouse-manager/purchase-orders', roles: [UserRole.WAREHOUSE_MANAGER] },
    { label: 'Sales Orders', icon: '🛍️', route: '/warehouse-manager/sales-orders', roles: [UserRole.WAREHOUSE_MANAGER] },
    { label: 'Inventory', icon: '📦', route: '/warehouse-manager/inventory', roles: [UserRole.WAREHOUSE_MANAGER] },
    { label: 'Settings', icon: '⚙️', route: '/warehouse-manager/settings', roles: [UserRole.WAREHOUSE_MANAGER] }
  ];
  
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  isActiveRoute(route: string): boolean {
    // Exact match for the route
    if (this.router.url === route) {
      return true;
    }
    // For dashboard, only match exact route or route with query params
    if (route === '/admin' || route === '/admin/dashboard' || route === '/warehouse-manager' || route === '/warehouse-manager/dashboard') {
      return this.router.url === route || this.router.url === route + '/dashboard' || this.router.url.startsWith(route + '?');
    }
    // For other routes, check if current URL starts with the route
    return this.router.url.startsWith(route);
  }

  hasAccess(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return this.authService.hasAnyRole(item.roles);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
