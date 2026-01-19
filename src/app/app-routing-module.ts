import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Home } from './features/home/home';
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
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
