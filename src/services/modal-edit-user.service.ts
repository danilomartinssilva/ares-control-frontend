import { Injectable } from '@angular/core';
import { UsersResponse } from '../types/users/users';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalEditUserService {
  private readonly modalEditUserSubject = new Subject<{
    show: boolean;
    userSelected: UsersResponse | null;
  }>();

  constructor() {}

  public show(user: UsersResponse | null): void {
    console.log('🚀 ~ ModalEditUserService ~ show ~ user:', user);
    this.modalEditUserSubject.next({ show: true, userSelected: user });
  }

  public hide(): void {
    this.modalEditUserSubject.next({ show: false, userSelected: null });
  }

  public getModalState() {
    return this.modalEditUserSubject.asObservable();
  }
}
