import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIcon],
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
  providers: [UsersService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  usersSubscribers: UsersResponse[] = [];
  loading: boolean = true;
  error: string = '';

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

  private removeUser(userId: string): void {
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

  ngOnInit() {
    this.subscribeToUsers();
  }
}
