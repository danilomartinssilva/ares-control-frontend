import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { UsersResponse } from '../../types/users/users';
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
