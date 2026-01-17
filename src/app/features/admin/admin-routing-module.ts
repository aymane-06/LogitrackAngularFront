import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Products } from './products/products';
import { Warehouses } from './warehouses/warehouses';
import { Carriers } from './carriers/carriers';
import { Suppliers } from './suppliers/suppliers';
import { Users } from './users/users';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'products', component: Products },
  { path: 'warehouses', component: Warehouses },
  { path: 'carriers', component: Carriers },
  { path: 'suppliers', component: Suppliers },
  { path: 'users', component: Users }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
