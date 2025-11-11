import { Component, inject, OnChanges, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ionCheckmarkCircle } from '@ng-icons/ionicons';
import { AddressResponse } from '../../../types/address/address';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalEditAddressService } from '../../../services/modal-edit-address/modal-edit-address.service';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from '../../../services/address/address.service';
import { UsersResponse } from '../../../types/users/users';

@Component({
  selector: 'app-new-address',
  standalone: true,
  imports: [NgIcon, CommonModule, ReactiveFormsModule],
  templateUrl: './new-address.component.html',
  styleUrl: './new-address.component.css',
  viewProviders: [
    provideIcons({
      ionCheckmarkCircle,
    }),
  ],
})
export class NewAddressComponent implements OnInit, OnChanges {
  isVisible: boolean = false;
  addressSelected: Partial<AddressResponse> | null = null;
  private toastService = inject(ToastrService);
  private modalEditAddressService = inject(ModalEditAddressService);
  private addressService = inject(AddressService);
  userSelected?: UsersResponse;
  editAddressForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.modalEditAddressService.getModalState().subscribe((state) => {
      this.isVisible = state.show;
      this.addressSelected = state.addressSelected || null;
      this.userSelected = state.userSelected || undefined;
      if (this.addressSelected) {
        this.editAddressForm.patchValue(this.addressSelected);
      } else {
        this.editAddressForm.reset();
      }
    });
    console.log(this.editAddressForm.errors);
  }
  message: string = 'Preencha os campos para cadastrar um novo endereço.';
  title: string = 'Novo Endereço';

  ngOnChanges(): void {
    console.log(this.editAddressForm.errors);
  }

  private initForm(): void {
    this.editAddressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.pattern(/^\d{8}$/), // Garante o formato 12345678
        ],
      ],
      alias: ['', Validators.required],
    });
  }

  maskedZipCode(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.substring(0, 8);
    }
    let maskedValue = value;
    if (value.length > 5) {
      maskedValue = value.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
    }

    event.target.value = maskedValue;
    this.editAddressForm.get('zipCode')?.setValue(value, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.editAddressForm.valid) {
      this.addressService
        .createAddress({
          alias: this.editAddressForm.value.alias,
          street: this.editAddressForm.value.street,
          city: this.editAddressForm.value.city,
          state: this.editAddressForm.value.state,
          zipCode: String(this.editAddressForm.value.zipCode),
          userId: this.userSelected ? this.userSelected.id : '',
          country: this.editAddressForm.value.country || 'Brasil',
          defaultAddress: false,
        })
        .subscribe({
          next: () => {
            this.toastService.success('Endereço criado com sucesso!');
            this.modalEditAddressService.hide();
            this.editAddressForm.reset();
          },
        });
    } else {
      this.toastService.error(
        'Por favor, preencha todos os campos corretamente.'
      );
    }
  }

  close(): void {
    this.modalEditAddressService.hide();
  }
}
