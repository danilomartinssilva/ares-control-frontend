import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UsersResponse } from '../../types/users/users';
import { AddressResponse } from '../../types/address/address';

@Injectable({
  providedIn: 'root',
})
export class ModalEditUserService {
  private readonly modalEditUserSubject = new Subject<{
    show: boolean;
    userSelected: UsersResponse | null;
    addressSelected?: AddressResponse | null;
  }>();

  constructor() {}

  public show(
    user: UsersResponse | null,
    address: AddressResponse | null
  ): void {
    this.modalEditUserSubject.next({
      show: true,
      userSelected: user,
      addressSelected: address,
    });
  }

  public hide(): void {
    this.modalEditUserSubject.next({
      show: false,
      userSelected: null,
      addressSelected: null,
    });
  }

  public getModalState() {
    return this.modalEditUserSubject.asObservable();
  }
}
