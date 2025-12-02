import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-main-navbar',
  standalone: false,
  templateUrl: './main-navbar.component.html',
  styleUrl: './main-navbar.component.css'
})
export class MainNavbarComponent {
  userRole: 'guest' | 'doctor' | 'admin' = 'guest';
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService,@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.loadUserRole();
  }

  loadUserRole(): void {
    if (isPlatformBrowser(this.platformId)) {
    const currentUser = this.authService.getCurrentUser();
    const token = currentUser?.token;
    const role = currentUser?.role;

    if (token && role) {
      this.userRole = role.toLowerCase() as 'doctor' | 'admin';
      this.isLoggedIn = true;
    } else {
      this.userRole = 'guest';
      this.isLoggedIn = false;
    }
  }
  }

  logout(): void {
    this.isLoggedIn = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
