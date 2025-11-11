import { Injectable } from '@angular/core';
import { AddressResponse } from '../../types/address/address';
import { Subject } from 'rxjs';
import { UsersResponse } from '../../types/users/users';

interface ModalEditAddressState {
  show: boolean;
  userSelected?: UsersResponse;
  addressSelected?: AddressResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class ModalEditAddressService {
  private readonly modalEditAddressSubject = new Subject<{
    show: boolean;
    userSelected?: UsersResponse;
    addressSelected?: AddressResponse | null;
  }>();

  constructor() {}

  public show(props: ModalEditAddressState): void {
    this.modalEditAddressSubject.next({
      show: true,
      userSelected: props.userSelected,
      addressSelected: props.addressSelected,
    });
  }

  public hide(): void {
    this.modalEditAddressSubject.next({
      show: false,
      userSelected: undefined,
      addressSelected: null,
    });
  }

  public getModalState() {
    return this.modalEditAddressSubject.asObservable();
  }
}
