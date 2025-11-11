import { TestBed } from '@angular/core/testing';

import { ModalEditUserService } from './modal-edit-user.service';

describe('ModalEditUserService', () => {
  let service: ModalEditUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
