import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit } from '@angular/core';
import {
  ionCheckmarkCircle,
  ionChevronBack,
  ionChevronForward,
  ionLockClosed,
  ionLockOpen,
  ionTrash,
} from '@ng-icons/ionicons';

import { AddressResponse } from '../../../types/address/address';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AddressService } from '../../../services/address/address.service';
import {
  ModalConfirmService,
  ModalData,
} from '../../../services/modal-confirm/modal-confirm.service';
import { NewAddressComponent } from '../new-address/new-address.component';
import { ModalEditAddressService } from '../../../services/modal-edit-address/modal-edit-address.service';
import { UsersService } from '../../../services/users/users.service';
import { UsersResponse } from '../../../types/users/users';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ModalConfirmComponent } from '../../share/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    CommonModule,
    NgIcon,
    NewAddressComponent,
    RouterLink,
    ModalConfirmComponent,
  ],
  templateUrl: './address.component.html',
  viewProviders: [
    provideIcons({
      ionLockClosed,
      ionLockOpen,
      ionTrash,
      ionCheckmarkCircle,
      ionChevronBack,
      ionChevronForward,
    }),
  ],
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  loading: boolean = true;

  private userId: string | null = null;
  userSelected: UsersResponse | null = null;
  addressDefault: AddressResponse | null = null;

  // Injeções
  private route = inject(ActivatedRoute); // Adicionando o ActivatedRoute
  private addressService = inject(AddressService);
  private modalService = inject(ModalConfirmService);
  private userService = inject(UsersService);
  private modalEditAddressService = inject(ModalEditAddressService);

  private currentAddressToDelete: string | null = null;
  addressesSubscribers: AddressResponse[] = [];

  constructor() {}

  ngOnInit() {
    this.subscribeToModals();
    this.subscribeToAddresses();

    // 1. Obtém o ID do usuário da URL
    // Se a rota for /address/:userId, o parâmetro deve ser lido.
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId'); // Assumindo que o nome do parâmetro é 'userId'

      if (this.userId) {
        // 2. Só chama os serviços APÓS obter um userId válido
        this.findByUserId(this.userId);
        this.loadAddresses();
      } else {
        // Se o userId não for encontrado, você pode definir um erro ou redirecionar
        console.error('ID do usuário não encontrado na rota.');
        this.loading = false;
        // Opcional: Redirecionar
        // const router = inject(Router);
        // router.navigate(['/error-page']);
      }
    });
  }

  // Refatorado para usar this.userId
  loadAddresses() {
    // A verificação `if (this.userId)` já é feita no ngOnInit
    this.addressService.getListAddressByUserId(this.userId!).subscribe();
  }

  subscribeToAddresses() {
    return this.addressService.addresses$.subscribe({
      next: (addresses) => {
        this.addressesSubscribers = addresses;
        this.addressDefault =
          this.addressesSubscribers.find((address) => address.defaultAddress) ||
          null;

        this.loading = false;
      },
      error: (error) => {
        // Adicionado tratamento de erro para debug
        console.error('Erro ao carregar endereços:', error);
        this.loading = false;
      },
    });
  }

  callModalConfirmRemove(address: AddressResponse): void {
    const modalData: ModalData = {
      message: `Deseja realmente excluir o endereço "${address.street}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
    };

    this.currentAddressToDelete = address.id;
    this.modalService.show(modalData);
  }

  private deleteAddress(addressId: string): void {
    this.addressService.removeAddress(addressId).subscribe({
      next: () => {
        this.addressesSubscribers = this.addressesSubscribers.filter(
          (address) => address.id !== addressId
        );
      },
      error: (error) => {
        console.error('Error deleting address in component:', error);
      },
    });
  }

  private findByUserId(userId: string): void {
    this.userService.findById(userId).subscribe({
      next: (user) => {
        this.userSelected = user;
      },
      error: (error) => {
        console.error('Error fetching user by ID:', error);
        // Garante que o loading seja false mesmo em caso de erro
        this.loading = false;
      },
    });
  }

  private subscribeToModals(): void {
    this.modalService.getResult().subscribe((result) => {
      if (result && this.currentAddressToDelete) {
        this.deleteAddress(this.currentAddressToDelete);
      }
    });
  }

  callModalAddressUser(): void {
    this.modalEditAddressService.show({
      show: true,
      userSelected: {
        id: this.userSelected?.id,
        name: this.userSelected?.name,
        email: this.userSelected?.email,
        phone: this.userSelected?.phone,
      },
      addressSelected: null,
    });
  }

  setDefaultAddress(addressSelected: AddressResponse): void {
    this.addressService
      .setDefaultAddress(addressSelected.id, addressSelected.userId)
      .subscribe();
  }
}
