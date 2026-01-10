import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshTokenResponse, RegisterRequest, User, UserRole } from '../../shared/models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api'; 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Initialize current user from storage
    const user = this.tokenService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.tokenService.setAccessToken(response.accessToken);
          this.tokenService.setRefreshToken(response.refreshToken);
          this.tokenService.setUser(response.user);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.tokenService.setAccessToken(response.accessToken);
          this.tokenService.setRefreshToken(response.refreshToken);
          this.tokenService.setUser(response.user);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.tokenService.setAccessToken(response.accessToken);
          this.tokenService.setRefreshToken(response.refreshToken);
        })
      );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  /**
   * Navigate to dashboard based on user role
   */
  navigateToDashboard(): void {
    const user = this.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    switch (user.role) {
      case UserRole.ADMIN:
        this.router.navigate(['/admin/dashboard']);
        break;
      case UserRole.WAREHOUSE_MANAGER:
        this.router.navigate(['/warehouse/dashboard']);
        break;
      case UserRole.CLIENT:
        this.router.navigate(['/client/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
