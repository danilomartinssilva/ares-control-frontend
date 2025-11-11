import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AddressCreatePayloadRequest,
  AddressResponse,
} from '../../types/address/address';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private readonly apiUrl = environment.baseUrl;
  private readonly http = inject(HttpClient);
  private readonly addressSubject = new BehaviorSubject<AddressResponse[]>([]);
  constructor() {}

  getListAddressByUserId(userId: string) {
    return this.http
      .get<AddressResponse[]>(`${this.apiUrl}/address/user/${userId}`)
      .pipe(
        tap((response) => {
          this.addressSubject.next(response);
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  createAddress(addressData: Partial<AddressCreatePayloadRequest>) {
    return this.http
      .post<AddressResponse>(`${this.apiUrl}/address`, addressData)
      .pipe(
        tap((newAddress) => {
          const currentAddresses = this.addressSubject.getValue();
          this.addressSubject.next([...currentAddresses, newAddress]);
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  removeAddress(addressId: string) {
    return this.http.delete<void>(`${this.apiUrl}/address/${addressId}`).pipe(
      tap(() => {
        const currentAddresses = this.addressSubject.getValue();
        const updatedAddresses = currentAddresses.filter(
          (address) => address.id !== addressId
        );
        console.log(
          '🚀 ~ AddressService ~ removeAddress ~ updatedAddresses:',
          updatedAddresses
        );
        this.addressSubject.next(updatedAddresses);
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  //set-default/:addressId/user/:userId
  setDefaultAddress(addressId: string, userId: string) {
    return this.http
      .put<AddressResponse>(
        `${this.apiUrl}/address/set-default/${addressId}/user/${userId}`,
        {}
      )
      .pipe(
        tap((updatedAddress) => {
          const currentAddresses = this.addressSubject.getValue();
          /*  const updatedAddresses = currentAddresses.map((address) =>
            address.id === updatedAddress.id ? updatedAddress : address
          ); */
          const updatedAddresses = currentAddresses.map((address) => {
            if (address.userId === userId) {
              return {
                ...address,
                defaultAddress: address.id === updatedAddress.id,
              };
            }
            return address;
          });

          this.addressSubject.next(updatedAddresses);
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  get addresses$() {
    return this.addressSubject.asObservable();
  }
}
