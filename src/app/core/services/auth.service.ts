import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../models/layout.models';
import { jwtDecode } from 'jwt-decode';
import { GlobalComponent } from '../../globalComponent';
import { isPlatformBrowser } from '@angular/common';


const AUTH_API = GlobalComponent.AUTH_API;
const LOGIN_ENDPOINT = GlobalComponent.login;
const VALIDATE_TOKEN_ENDPOINT = GlobalComponent.validateToken;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(AUTH_API + LOGIN_ENDPOINT, { username, password }).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }
  
  setCurrentUser(user: any) {
    if (isPlatformBrowser(this.platformId)) {
      const normalizedUser: User = {
        name: user.Name,
        role: user.Role,
        userId: user.UserId,
        token: user.Token,
        doctorId: user.DoctorId ?? null
      };

      localStorage.setItem('userInfo', JSON.stringify(normalizedUser));
      this.currentUserSubject.next(normalizedUser);
    }
  }

  getCurrentUser() {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('userInfo')!);
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserSubject.next(null);
      localStorage.removeItem('Jwttoken');
      localStorage.removeItem('role');
      localStorage.removeItem('userInfo');
    }
  }


  getUserRoles(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = this.getCurrentUser();
      if (!currentUser || !currentUser.token) return [];
      try {
        const decoded: any = jwtDecode(currentUser.token);
        if (decoded.role) {
          return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
        }
        return [];
      } catch (e) {
        console.error('Invalid token', e);
        return [];
      }
    }
    return [];
  }


  validateToken(): Observable<{ valid: boolean; message?: string }> {
    return this.http.get<{ isValid: boolean }>(AUTH_API + VALIDATE_TOKEN_ENDPOINT).pipe(
      map(response => ({ valid: response.isValid })),
      catchError(err => {
        let msg = 'Unknown error';
        if (err.status === 401) {
          msg = 'Your token is invalid or expired';
        } else if (err.status === 0) {
          msg = 'Unable to reach server';
        }
        return of({ valid: false, message: msg });
      })
    );
  }



  //   hasRole(role: string): boolean {
  //   return this.currentUserSubject.value?.role === role;
  // }
}
