import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            switch (error.status) {
              case 400:
                errorMessage = 'Bad Request: Please check your input.';
                break;
              case 401:
                errorMessage = 'Unauthorized: Please login again.';
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

        // You can show a toast/snackbar here
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
