import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: false
})
export class AdminDashboard implements OnInit {

  stats = [
    { title: 'Total Users', value: '2,543', icon: '👥', color: 'blue' as const, trend: { value: 12, isPositive: true } },
    { title: 'Active Orders', value: '1,234', icon: '📦', color: 'green' as const, trend: { value: 8, isPositive: true } },
    { title: 'Warehouses', value: '24', icon: '🏢', color: 'purple' as const, trend: { value: 2, isPositive: true } },
    { title: 'Revenue', value: '$125K', icon: '💰', color: 'orange' as const, trend: { value: 5, isPositive: false } }
  ];

  ngOnInit(): void {
    // Load dashboard data
  }
}
