import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './dashboard/admin-dashboard';
import { Products } from './products/products';
import { Suppliers } from './suppliers/suppliers';
import { Users } from './users/users';
import { Warehouses } from './warehouses/warehouses';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboard
  },
  {
    path: 'dashboard',
    component: AdminDashboard
  },
  {
    path: 'users',
    component: Users
  },
  {
    path: 'products',
    component: Products
  },
  {
    path: 'warehouses',
    component: Warehouses
  },
  {
    path: 'suppliers',
    component: Suppliers
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
