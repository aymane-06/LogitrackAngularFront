import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

// State for refresh token logic
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // Skip interceptor for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh-token')) {
    return next(req);
  }

  // Add access token to request
  const accessToken = tokenService.getAccessToken();
  if (accessToken) {
    req = addToken(req, accessToken);
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        return handle401Error(req, next, authService, tokenService, error);
      }
      return throwError(() => error);
    })
  );
};

// Helper function to add token to request
function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

// Handle 401/403 errors
// Handle 401/403 errors
function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  tokenService: TokenService,
  error: HttpErrorResponse
): Observable<HttpEvent<any>> {
  // If error is 403 Forbidden, only refresh if token is actually expired
  if (error.status === 403) {
    const accessToken = tokenService.getAccessToken();
    if (accessToken && !tokenService.isTokenExpired(accessToken)) {
       // Token is valid but access is forbidden -> Permission issue. Do not refresh.
       return throwError(() => error);
    }
  }

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);
    
    const refreshToken = tokenService.getRefreshToken();

    if (refreshToken) {
      return authService.refreshToken().pipe(
        switchMap((response: any) => {
          isRefreshing = false;
          refreshTokenSubject.next(response.accessToken);
          return next(addToken(request, response.accessToken));
        }),
        catchError((err) => {
          isRefreshing = false;
          refreshTokenSubject.next(null);
          authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      isRefreshing = false;
      refreshTokenSubject.next(null);
      // Don't logout on server/if no token, just fail
      // authService.logout(); // Navigate might be problematic on server if caused by this
      // Return original error so caller can handle it
      return throwError(() => error);
    }
  } else {
    // Wait for refresh to complete
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        return next(addToken(request, token!));
      })
    );
  }
}

