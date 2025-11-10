import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../types/login/login';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

interface JwtPayload {
  sub: string;
  email: string;
  exp: number;
}
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = 'http://localhost:3002';
  private readonly http = inject(HttpClient);
  private readonly isLoggedSubject = new BehaviorSubject<boolean>(false);
  isLogged$ = this.isLoggedSubject.asObservable();

  constructor() {}

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/signin`, credentials)
      .pipe(
        tap((response) => {
          sessionStorage.setItem('auth-token', response.token);
          sessionStorage.setItem('userId', response.id);
        })
      );
  }

  isLoggedIn(): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      this.isLoggedSubject.next(false);
      return false;
    }
    if (this.hasTokenActive(decodedToken)) {
      this.isLoggedSubject.next(false);
      return false;
    }
    this.isLoggedSubject.next(true);
    return true;
  }

  private getDecodedToken(): JwtPayload | null {
    const token = sessionStorage.getItem('auth-token') || '';
    if (!token) {
      return null;
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private hasTokenActive(payload: JwtPayload): boolean {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return false;
    }
    const expirationDate = payload.exp * 1000;
    return expirationDate < Date.now();
  }

  public clearSession() {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('userId');
  }
}
