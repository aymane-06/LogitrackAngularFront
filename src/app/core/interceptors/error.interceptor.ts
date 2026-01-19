import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error - prioritize server message
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          } else {
            // Fallback to generic messages
            switch (error.status) {
              case 0:
                errorMessage = 'Unable to connect to the server. Please check your internet connection or try again later.';
                break;
              case 400:
                errorMessage = 'Bad Request: Please check your input.';
                break;
              case 401:
                errorMessage = 'Invalid credentials. Please check your email and password.';
                break;
              case 403:
                errorMessage = 'Forbidden: You don\'t have permission to access this resource.';
                break;
              case 404:
                errorMessage = 'Not Found: The requested resource was not found.';
                break;
              case 409:
                errorMessage = 'Conflict: The resource is being modified by another user.';
                break;
              case 500:
                errorMessage = 'Internal Server Error: Please try again later.';
                break;
              default:
                errorMessage = `Error ${error.status}: ${error.statusText}`;
            }
          }
        }

        // Show toast notification
        this.toastService.error(errorMessage);
        
        console.error('API Error:', {
          status: error.status,
          message: errorMessage,
          url: request.url,
          timestamp: new Date().toISOString()
        });

        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          error: error.error
        }));
      })
    );
  }
}
