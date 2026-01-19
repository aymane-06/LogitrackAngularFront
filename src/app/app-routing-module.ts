import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Home } from './features/home/home';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized';
import { UserRole } from './shared/models/user.model';

const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] },
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'warehouse-manager',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.WAREHOUSE_MANAGER] },
    loadChildren: () => import('./features/warehouse-manager/warehouse-manager-module').then(m => m.WarehouseManagerModule)
  },
  {
    path: 'client',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.CLIENT] },
    loadChildren: () => import('./features/client/client-module').then(m => m.ClientModule)
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
