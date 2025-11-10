import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../types/login/login';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = 'http://localhost:3002';
  private readonly http = inject(HttpClient);

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
}
