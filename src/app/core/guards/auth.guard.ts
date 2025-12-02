import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map, Observable, of } from "rxjs";

import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const currentUser = this.authenticationService.getCurrentUser();
    if (!currentUser?.token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.authenticationService.validateToken().pipe(
      map(result => {
        //debugger;
        if (!result.valid) {
          this.authenticationService.logout();
          Swal.fire({
            icon: 'error',
            title: 'Authentication Failed',
            text: result.message || 'Your session has expired. Please log in again.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/login']);
          });
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        return of(false);
      })
    );

  }
}