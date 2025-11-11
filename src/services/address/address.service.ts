import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddressResponse } from '../../types/address/address';

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
      .get<AddressResponse[]>(`${this.apiUrl}/addresses/user/${userId}`)
      .pipe(
        tap((response) => {
          this.addressSubject.next(response);
        }),
        catchError((error) => {
          console.error('Error fetching addresses:', error);
          throw error;
        })
      );
  }

  createAddress(addressData: Partial<AddressResponse>) {
    return this.http
      .post<AddressResponse>(`${this.apiUrl}/address`, addressData)
      .pipe(
        tap((newAddress) => {
          const currentAddresses = this.addressSubject.getValue();
          this.addressSubject.next([...currentAddresses, newAddress]);
        }),
        catchError((error) => {
          console.error('Error creating address:', error);
          throw error;
        })
      );
  }

  get addresses$() {
    return this.addressSubject.asObservable();
  }
}
