import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SweetAlertService } from '../../core/services/sweet-alert.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  credentials = { username: '', password: '' };
  showValidationToast: boolean = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private sweetAlertService: SweetAlertService) { }

  ngOnInit() {
    //debugger;
    
    const currentUser = this.authService.getCurrentUser();
    console.log(this.authService.getCurrentUser());
    if (currentUser) {
      this.redirectByRole(currentUser.role);
    }
  }

    Login(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      this.showValidationToast = true;
      return;
    }

    this.showValidationToast = false;

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
      next: (res: any) => {
        //debugger;
        // Save token and user
        const user = res.response;
        this.authService.setCurrentUser(user);
        this.sweetAlertService.showSuccess(`Welcome back, ${user.Name}!`);
        this.redirectByRole(user.Role);
      },
      error: (err) => {
        const message = err?.error?.message || 'Login failed. Please try again.';
        this.sweetAlertService.showError(message);
      }
    });
  }

  private redirectByRole(Role: string) {
    if (Role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (Role === 'Doctor') {
      this.router.navigate(['/doctors/appointments-list']);
    } else {
      this.sweetAlertService.showError('Unknown role detected!');
    }
  }
}
