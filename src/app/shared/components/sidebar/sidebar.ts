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
    { label: 'Dashboard', icon: '📊', route: '/admin' },
    { label: 'Users', icon: '👥', route: '/admin/users' },
    { label: 'Products', icon: '📦', route: '/admin/products' },
    { label: 'Warehouses', icon: '🏢', route: '/admin/warehouses' },
    { label: 'Suppliers', icon: '🤝', route: '/admin/suppliers' },
    { label: 'Purchase Orders', icon: '📋', route: '/admin/purchase-orders' },
    { label: 'Reports', icon: '📈', route: '/admin/reports' },
    { label: 'Settings', icon: '⚙️', route: '/admin/settings' }
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
    if (route === '/admin' || route === '/admin/dashboard') {
      return this.router.url === route || this.router.url.startsWith(route + '?');
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
