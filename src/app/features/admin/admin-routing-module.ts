import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './dashboard/admin-dashboard';
import { Products } from './products/products';
import { Suppliers } from './suppliers/suppliers';
import { Users } from './users/users';
import { Warehouses } from './warehouses/warehouses';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboard },
  { path: 'products', component: Products },
  { path: 'warehouses', component: Warehouses },
  { path: 'suppliers', component: Suppliers },
  { path: 'users', component: Users }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
