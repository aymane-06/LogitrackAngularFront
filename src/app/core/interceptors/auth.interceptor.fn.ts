import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Skip interceptor for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Add access token to request
  const accessToken = tokenService.getAccessToken();
  console.log('AuthInterceptor: URL', req.url, 'Token found?', !!accessToken, 'Browser?', tokenService['isBrowser']);
  
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('AuthInterceptor: Added Authorization header');
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Handle 401 Error - Simple logout for now to avoid circular dependency complexity
        // The class-based one had refresh logic, but for debugging let's start simple
        // If we need refresh logic, we can port it, but 403 is our main issue now
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};
