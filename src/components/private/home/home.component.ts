import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../services/users/users.service';
import { UsersResponse } from '../../../types/users/users';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  ionCheckmarkCircle,
  ionChevronBack,
  ionChevronForward,
  ionLockClosed,
  ionLockOpen,
  ionTrash,
} from '@ng-icons/ionicons';
import { Router } from '@angular/router';
import {
  ModalConfirmService,
  ModalData,
} from '../../../services/modal-confirm/modal-confirm.service';
import { ModalConfirmComponent } from '../../share/modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIcon, ModalConfirmComponent],
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
  providers: [UsersService, ModalConfirmService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  usersSubscribers: UsersResponse[] = [];
  private modalService = inject(ModalConfirmService);
  private currentUserToDelete: string | null = null;

  loading: boolean = true;
  error: string = '';
  private router = inject(Router);

  constructor(private usersService: UsersService) {}

  private subscribeToUsers(): void {
    this.usersService.getListOfUsers().subscribe({
      next: (users) => {
        this.usersSubscribers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users in component:', error);
        this.loading = false;
        this.error = error.message || 'Unknown error';
      },
    });
  }

  callModalConfirmRemove(user: UsersResponse): void {
    console.log('🚀 ~ HomeComponent ~ callModalConfirmRemove ~ user:', user);
    const modalData: ModalData = {
      message: `Deseja realmente excluir o cliente "${user.name}"?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
    };

    this.currentUserToDelete = user.id;
    this.modalService.show(modalData);
  }

  private deleteUser(userId: string): void {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        this.usersSubscribers = this.usersSubscribers.filter(
          (user) => user.id !== userId
        );
      },
      error: (error) => {
        console.error('Error deleting user in component:', error);
      },
    });
  }

  redirectToAddsUser(): void {
    console.log('veio aqui');
    this.router.navigate(['/register']);
  }

  private subscribeToModals(): void {
    this.modalService.getResult().subscribe((result) => {
      if (result && this.currentUserToDelete) {
        this.deleteUser(this.currentUserToDelete);
      }
    });
  }
  ngOnInit() {
    this.subscribeToUsers();
    this.subscribeToModals();
  }
}
