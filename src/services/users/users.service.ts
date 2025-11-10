import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import {
  UserCreatePayloadRequest,
  UsersResponse,
} from '../../types/users/users';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiUrl = environment.baseUrl;
  private readonly http = inject(HttpClient);
  private readonly usersSubject = new BehaviorSubject<UsersResponse[]>([]);

  constructor() {}

  getListOfUsers() {
    return this.http.get<UsersResponse[]>(`${this.apiUrl}/users`).pipe(
      tap((response) => {
        this.usersSubject.next(response);
      }),
      catchError((error) => {
        console.error('Error fetching users:', error);
        throw error;
      })
    );
  }

  createUser(userData: UserCreatePayloadRequest) {
    return this.http.post<UsersResponse>(`${this.apiUrl}/users`, userData).pipe(
      tap((newUser) => {
        const currentUsers = this.usersSubject.getValue();
        this.usersSubject.next([...currentUsers, newUser]);
      }),
      catchError((error) => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  get users$() {
    return this.usersSubject.asObservable();
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`).pipe(
      tap(() => {
        const currentUsers = this.usersSubject.getValue();
        const updatedUsers = currentUsers.filter((user) => user.id !== userId);
        this.usersSubject.next(updatedUsers);
      }),
      catchError((error) => {
        console.error('Error deleting user:', error);
        throw error;
      })
    );
  }
}
