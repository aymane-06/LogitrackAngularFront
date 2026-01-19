import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserRole } from '../../shared/models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // On server-side rendering, always allow navigation (client will handle it)
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Get required roles from route data
    const requiredRoles = route.data['roles'] as UserRole[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Check if user has any of the required roles
    if (this.authService.hasAnyRole(requiredRoles)) {
      return true;
    }

    // Redirect to unauthorized page or dashboard
    console.error('Access denied: User does not have required role');
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
