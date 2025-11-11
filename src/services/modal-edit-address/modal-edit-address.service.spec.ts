import { TestBed } from '@angular/core/testing';

import { ModalEditAddressService } from './modal-edit-address.service';

describe('ModalEditAddressService', () => {
  let service: ModalEditAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
