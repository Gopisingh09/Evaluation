import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const allowedRoles = route.data?.['roles'] as string[] | undefined;
    if (!allowedRoles || allowedRoles.length === 0) {
      return of(true);
    }
    //debugger;
    const userRoles = this.authService.getUserRoles();

    const hasRole = userRoles?.some((r: string) => allowedRoles.includes(r));

    if (!hasRole) {
      Swal.fire({
        icon: 'warning',
        title: 'Access Denied',
        text: 'You do not have permission to access this page.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/']);
        ///redirect to home or another page
      });
      return of(false);
    }

    return of(true);
  }
}
