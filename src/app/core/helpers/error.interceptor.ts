import { Injectable } from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpHandler,HttpEvent,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SweetAlertService } from '../services/sweet-alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthService,private sweetAlert: SweetAlertService,private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('HTTP Error:', err);

        // 1: Network or client-side error
        if (err.error instanceof ErrorEvent) {
          this.sweetAlert.showError('A network or client-side error occurred. Please check your connection.');
          return throwError(() => err);
        }

        // 2: Backend returned an error response
        switch (err.status) {

          case 0: // No response / network issue
            this.sweetAlert.showError('Unable to reach the server. Please try again later.');
            break;

          case 400:
            this.sweetAlert.showError(err.error?.message || 'Bad request. Please check your input.');
            break;

          case 401:
            // this.authenticationService.logout();
            // this.router.navigate(['/login']);
            // this.sweetAlert.showError('Session expired. Please log in again.');

            break;

          case 403:
            this.sweetAlert.showError('You are not authorized to perform this action.');
            break;

          case 404:
            this.sweetAlert.showError('Requested resource not found.');
            break;

          case 409:
            this.sweetAlert.showError(err.error?.message || 'Conflict detected. Please refresh and try again.');
            break;

          case 500:
            this.sweetAlert.showError('A server error occurred. Please try again later.');
            break;

          default:
            this.sweetAlert.showError(`Unexpected error: ${err.statusText || 'Unknown error occurred.'}`);
            break;
        }
        return throwError(() => err);
      })
    );
  }
}
